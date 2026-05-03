import { create } from 'zustand';
import apiClient from '../api/client';
import { useProfileStore } from './useProfileStore';
import { useActionsStore } from './useActionsStore';
import { useEntityTypesStore } from './useEntityTypesStore';
import { useAuthStore } from './useAuthStore';
import { NAME_FIELDS } from '../utils/historyHelpers';
import { useComponentsStore } from './useComponentsStore';
import { enrichHistory } from '../utils/enrichHistory';
import { useWishlistStatusesStore } from './useWishlistStatusesStore';
const LAB_ROLE_ID = "bbc9c32e-8c47-43f4-bc68-c29f81754dac";
const PAGE_SIZE = 25;

export const useHistoryStore = create((set, get) => ({
  history: [],
  myHistory: [],
  allRawData: [],
  isLoading: false,
  lastHistoryAttempt: 0,
  recentHistory: new Map(),
  page: 1,
  hasMore: true,
  currentFetchKey: null,

 enrichHistory: (rawHistory) => enrichHistory(rawHistory),

  ensureDependenciesLoaded: async () => {
  const profileStore = useProfileStore.getState();
  const actionsStore = useActionsStore.getState();
  const entityTypesStore = useEntityTypesStore.getState();
  const componentsStore = useComponentsStore.getState();
  const wishlistStatusesStore = useWishlistStatusesStore.getState();

  const tasks = [];
  if (!profileStore.profile) tasks.push(profileStore.fetchProfile());
  if (actionsStore.actions.length === 0) tasks.push(actionsStore.fetchActions());
  if (entityTypesStore.entityTypes.length === 0) tasks.push(entityTypesStore.fetchEntityTypes());
  if (componentsStore.components.length === 0) tasks.push(componentsStore.fetchComponents());

  if (!wishlistStatusesStore.statuses || wishlistStatusesStore.statuses.length === 0) {
    tasks.push(wishlistStatusesStore.fetchStatuses());
  }

  if (tasks.length > 0) await Promise.all(tasks);
},

  _handleFetch: async (fetchFn, isAppend = false, targetPage = 1, fetchKey = 'default') => {
  if (get().isLoading) return;

  const isNewRequest = get().currentFetchKey !== fetchKey;

  if (isNewRequest) {
    set({ allRawData: [], history: [], myHistory: [], page: 1, currentFetchKey: fetchKey });
  }

  const shouldFetchFromApi = get().allRawData.length === 0;

  set({ isLoading: true, lastHistoryAttempt: Date.now() });

  try {
    await get().ensureDependenciesLoaded();

    let currentFullData = [];

    if (shouldFetchFromApi) {
      const responseData = await fetchFn();

      currentFullData = responseData || [];
      set({ allRawData: currentFullData });
    } else {
      currentFullData = get().allRawData;
    }

    const start = (targetPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    const pageChunk = currentFullData.slice(start, end);
    const enriched = get().enrichHistory(pageChunk);

    const result = {
      history: isAppend ? [...get().history, ...enriched] : enriched,
      myHistory: isAppend ? [...get().myHistory, ...enriched] : enriched,
      page: targetPage,
      hasMore: end < currentFullData.length,
      isLoading: false
    };

    set(result);
    return enriched;

  } catch (error) {
    console.error('History Store Error:', error);
    set({ isLoading: false, lastHistoryAttempt: 0 });
    return [];
  }
},

  fetchHistoryByUser: async (userId, reset = true, targetPage = 1) => {
    const pageToLoad = reset ? targetPage : get().page + 1;
    await get()._handleFetch(async () => {
      const response = await apiClient.get(`/history/by-user/${userId}`);
      return response.data;
    }, !reset, pageToLoad, `user-${userId}`);
  },

  fetchMyHistory: async (reset = true, targetPage = 1) => {
    const myUserId = useProfileStore.getState().profile?.id;
    if (!myUserId) return;

    const pageToLoad = reset ? targetPage : get().page + 1;
    await get()._handleFetch(async () => {
      const response = await apiClient.get('/history/my', { params: { userId: myUserId } });
      return response.data;
    }, !reset, pageToLoad, 'my-history');
  },

  fetchHistoryByEntity: async (entityId, reset = true, targetPage = 1) => {
  const pageToLoad = reset ? targetPage : get().page + 1;

  return await get()._handleFetch(async () => {
    const response = await apiClient.get(
      `/history/by-type/${entityId.trim()}`
    );

    return response.data;
  }, !reset, pageToLoad, `entity-${entityId}`);
},

fetchHistoryByEntityId: async (entityId, reset = true, targetPage = 1) => {
    if (!entityId) return;

    const pageToLoad = reset ? targetPage : get().page + 1;
    return await get()._handleFetch(async () => {
      const response = await apiClient.get(
        `/history/by-entity/${String(entityId).trim()}`
      );
      return response.data;
    }, !reset, pageToLoad, `entity-id-${entityId}`);
},

  fetchAllHistory: async (reset = true, targetPage = 1) => {
    const { user } = useAuthStore.getState();
    const isLab = user?.roles?.includes(LAB_ROLE_ID) || user?.role === "Lab";

    if (isLab) return get().fetchMyHistory(reset, targetPage);

    const pageToLoad = reset ? targetPage : get().page + 1;
    await get()._handleFetch(async () => {
      const response = await apiClient.get('/history/all');
      return response.data;
    }, !reset, pageToLoad, 'all-history');
  },

  fetchWidgetHistory: async () => {
    const authStore = useAuthStore.getState();
    const profileStore = useProfileStore.getState();
    const currentUser = authStore.user || profileStore.profile;
    const isLab = currentUser?.roles?.includes(LAB_ROLE_ID) || currentUser?.role === "Lab";
    return isLab ? get().fetchMyHistory(true, 1) : get().fetchAllHistory(true, 1);
  },

  addHistoryEntry: async (historyData) => {
    await get().ensureDependenciesLoaded();
    const currentUserId = useProfileStore.getState().profile?.id;
    if (!currentUserId) throw new Error('Авторизуйтесь для логування!');

    const response = await apiClient.post('/history', { ...historyData, userId: currentUserId });
    const newEntry = get().enrichHistory([response.data])[0];

    set((state) => ({
      history: [newEntry, ...state.history],
      allRawData: [response.data, ...state.allRawData],
      myHistory: currentUserId === newEntry.userId ? [newEntry, ...state.myHistory] : state.myHistory
    }));

    return newEntry;
  },

  getHistoryCount: () => get().allRawData.length,
  getMyHistoryCount: () => get().myHistory.length,
  isEmpty: () => get().allRawData.length === 0,
  clearHistory: () => set({ history: [], myHistory: [], allRawData: [], page: 1, hasMore: true, currentFetchKey: null }),
  clearMyHistory: () => set({ myHistory: [], allRawData: [], page: 1, hasMore: true, currentFetchKey: null }),
  getSearchOptions: () => {
  const { history, allRawData } = get();

  const source = history.length ? history : allRawData;

  return source.map(item => ({
    id: item.entityId,
    type: item.entityTypeName,
    label: item.searchLabel,
  }));
},
}));