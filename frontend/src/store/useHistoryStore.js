import { create } from 'zustand';
import apiClient from '../api/client';
import { useProfileStore } from './useProfileStore';
import { useActionsStore } from './useActionsStore';
import { useEntityTypesStore } from './useEntityTypesStore';
import { useAuthStore } from './useAuthStore';
import { useWishlistStatusesStore } from './useWishlistStatusesStore';
import { safeParse, formatChanges, isDateField, dateFormatter, NAME_FIELDS } from '../utils/historyHelpers';

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

  enrichHistory: (rawHistory) => {
    if (!rawHistory?.length) return [];

    const profileStore = useProfileStore.getState();
    const actionsMap = new Map(useActionsStore.getState().actions.map(a => [a.id, a]));
    const entityTypes = useEntityTypesStore.getState().entityTypes;
    const entityTypesMap = new Map(entityTypes.map(t => [t.id, t]));
    const statusesMap = new Map(useWishlistStatusesStore.getState().statuses.map(s => [s.id, s]));

    const allEntitiesMap = new Map();
    entityTypes.forEach(type => {
      type.entities?.forEach(e => allEntitiesMap.set(e.id, e.name || e.title));
    });

    return rawHistory.map((record) => {
      const action = actionsMap.get(record.actionId);
      const entityType = entityTypesMap.get(record.entityTypeId);
      const oldValues = safeParse(record.oldValues);
      const newValues = safeParse(record.newValues);

      let specificEntityName = entityType?.name || 'Сутність';

      for (const field of NAME_FIELDS) {
        const val = oldValues[field] || newValues[field];
        if (val?.trim() && !isDateField(val)) {
          specificEntityName = val;
          break;
        }
      }

      if (specificEntityName === entityType?.name) {
        const allChanges = { ...oldValues, ...newValues };
        for (const [key, value] of Object.entries(allChanges)) {
          if (!key.toLowerCase().includes('id') &&
              typeof value === 'string' &&
              value.trim().length > 2 &&
              !isDateField(value)) {
            specificEntityName = value.trim().slice(0, 50);
            break;
          }
        }
      }

      if (specificEntityName === entityType?.name && record.entityId) {
        const nameFromMap = allEntitiesMap.get(record.entityId) || statusesMap.get(record.entityId)?.name;
        if (nameFromMap) specificEntityName = nameFromMap;
      }

      if (specificEntityName === entityType?.name) {
        specificEntityName = `${entityType?.name} #${record.entityId?.slice(-8)}`;
      }

      const isMe = profileStore.profile?.id === record.userId;
      let userName, userAvatar;

      if (record.authorFirstName) {
        userName = `${record.authorFirstName}${record.authorLastName ? ` ${record.authorLastName}` : ''}`;
        userAvatar = record.authorPhotoUrl || null;
      } else if (isMe) {
        const p = profileStore.profile;
        userName = `${p.firstName || p.name || 'Я'}${p.lastName ? ` ${p.lastName}` : ''}`;
        userAvatar = p.photoUrl || p.avatar || null;
      } else {
        userName = `Користувач ${record.userId?.slice(-6)}`;
        userAvatar = null;
      }

      return {
        ...record,
        actionName: action?.name || 'Дія',
        entityName: specificEntityName,
        userName,
        userAvatar,
        changesText: formatChanges(record.oldValues, record.newValues),
        timeFormatted: dateFormatter.format(new Date(record.time))
      };
    });
  },

  ensureDependenciesLoaded: async () => {
    const profileStore = useProfileStore.getState();
    const actionsStore = useActionsStore.getState();
    const entityTypesStore = useEntityTypesStore.getState();
    const wishlistStatusesStore = useWishlistStatusesStore.getState();

    const tasks = [];
    if (!profileStore.profile) tasks.push(profileStore.fetchProfile());
    if (actionsStore.actions.length === 0) tasks.push(actionsStore.fetchActions());
    if (entityTypesStore.entityTypes.length === 0) tasks.push(entityTypesStore.fetchEntityTypes());
    if (wishlistStatusesStore.statuses.length === 0) tasks.push(wishlistStatusesStore.fetchStatuses());

    if (tasks.length > 0) await Promise.all(tasks);
  },

  _handleFetch: async (fetchFn, isAppend = false, targetPage = 1) => {
    const now = Date.now();
    const COOLDOWN_MS = 800;

    if (get().isLoading) return;

    const shouldFetchFromApi = targetPage === 1 || get().allRawData.length === 0;

    set({ isLoading: true, lastHistoryAttempt: now });

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

      set((state) => ({
        history: isAppend ? [...state.history, ...enriched] : enriched,
        myHistory: isAppend ? [...state.myHistory, ...enriched] : enriched,
        page: targetPage,
        hasMore: end < currentFullData.length,
        isLoading: false
      }));

    } catch (error) {
      console.error('History Store Error:', error);
      set({ isLoading: false, lastHistoryAttempt: 0 });
    }
  },

  fetchHistoryByUser: async (userId, reset = true, targetPage = 1) => {
    const pageToLoad = reset ? targetPage : get().page + 1;
    await get()._handleFetch(async () => {
      const response = await apiClient.get(`/history/by-user/${userId}`);
      return response.data;
    }, !reset, pageToLoad);
  },

  fetchMyHistory: async (reset = true, targetPage = 1) => {
    const myUserId = useProfileStore.getState().profile?.id;
    if (!myUserId) return;

    const pageToLoad = reset ? targetPage : get().page + 1;
    await get()._handleFetch(async () => {
      const response = await apiClient.get('/history/my', { params: { userId: myUserId } });
      return response.data;
    }, !reset, pageToLoad);
  },

  fetchHistoryByEntity: async (entityId, reset = true, targetPage = 1) => {
    const pageToLoad = reset ? targetPage : get().page + 1;
    await get()._handleFetch(async () => {
      const response = await apiClient.get(`/history/by-entity/${entityId}`);
      return response.data;
    }, !reset, pageToLoad);
  },

  fetchHistoryByEntityAndType: async (entityId, entityTypeId, reset = true, targetPage = 1) => {
    const pageToLoad = reset ? targetPage : get().page + 1;
    await get()._handleFetch(async () => {
      const response = await apiClient.get(`/history/by-entity-and-type/${entityId}/${entityTypeId}`);
      return response.data;
    }, !reset, pageToLoad);
  },

  fetchAllHistory: async (reset = true, targetPage = 1) => {
    const { user } = useAuthStore.getState();
    const isLab = user?.roles?.includes(LAB_ROLE_ID) || user?.role === "Lab";

    if (isLab) return get().fetchMyHistory(reset, targetPage);

    const pageToLoad = reset ? targetPage : get().page + 1;
    await get()._handleFetch(async () => {
      const response = await apiClient.get('/history/all');
      return response.data;
    }, !reset, pageToLoad);
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
  clearHistory: () => set({ history: [], myHistory: [], allRawData: [], page: 1, hasMore: true }),
  clearMyHistory: () => set({ myHistory: [], allRawData: [], page: 1, hasMore: true })
}));