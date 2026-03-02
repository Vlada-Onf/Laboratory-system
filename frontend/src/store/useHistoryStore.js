import { create } from 'zustand';
import apiClient from '../api/client';
import { useProfileStore } from './useProfileStore';
import { useActionsStore } from './useActionsStore';
import { useEntityTypesStore } from './useEntityTypesStore';
import { useAuthStore } from './useAuthStore';
import {useWishlistStatusesStore} from './useWishlistStatusesStore';
const LAB_ROLE_ID = "bbc9c32e-8c47-43f4-bc68-c29f81754dac";

export const useHistoryStore = create((set, get) => ({
  history: [],
  myHistory: [],
  isLoading: false,
  lastHistoryAttempt: 0,
  recentHistory: new Map(),

enrichHistory: (rawHistory) => {
  const profileStore = useProfileStore.getState();
  const actionsStore = useActionsStore.getState();
  const entityTypesStore = useEntityTypesStore.getState();
  const wishlistStatusesStore = useWishlistStatusesStore.getState();

  if (!rawHistory?.length){
    return [];
  }

  const safeParse = (data) => {
    if (!data || typeof data !== 'string'){
      return {};
    }
    try { return JSON.parse(data); }
    catch { return {}; }
  };

  const isDateField = (value) => {
    if (!value || typeof value !== 'string'){
      return false;
    }
    return value.match(/^\d{4}-\d{2}-\d{2}/) || value.includes('T') || value.includes('Z');
  };

  const formatChanges = (oldValuesStr, newValuesStr) => {
    let oldValues = {}, newValues = {};
    try {
      if (oldValuesStr) oldValues = JSON.parse(oldValuesStr);
      if (newValuesStr) newValues = JSON.parse(newValuesStr);
    } catch (error) {
      console.warn('Парсинг changes:', error);
      return 'Оновлено';
    }

    const changes = [];
    const allKeys = new Set([...Object.keys(oldValues), ...Object.keys(newValues)]);

    allKeys.forEach(key => {
      const oldVal = oldValues[key];
      const newVal = newValues[key];
      if (oldVal !== newVal) {
        changes.push(`${key}: "${oldVal || ''}" → "${newVal || ''}"`);
      }
    });
    return changes.length > 0 ? changes.join(', ') : 'Створено';
  };

  return rawHistory.map((record) => {
    const action = actionsStore.actions.find(a => a.id === record.actionId);
    const entityType = entityTypesStore.entityTypes.find(et => et.id === record.entityTypeId);
    const oldValues = safeParse(record.oldValues);
    const newValues = safeParse(record.newValues);

    let specificEntityName = entityType?.name || 'Сутність';

    const NAME_FIELDS = ['name', 'title', 'Name', 'Title', 'text', 'content', 'message', 'body'];
    for (const field of NAME_FIELDS) {
      if (oldValues[field]?.trim() && !isDateField(oldValues[field])) {
        specificEntityName = oldValues[field];
        break;
      }
      if (newValues[field]?.trim() && !isDateField(newValues[field])) {
        specificEntityName = newValues[field];
        break;
      }
    }

    if (specificEntityName === entityType?.name) {
      const allChanges = { ...oldValues, ...newValues };
      for (const [key, value] of Object.entries(allChanges)) {
        if (!key.toLowerCase().includes('id') &&
            value &&
            typeof value === 'string' &&
            value.trim().length > 2 &&
            !isDateField(value)) {
          specificEntityName = value.trim().slice(0, 50);
          break;
        }
      }
    }

    if (specificEntityName === entityType?.name && record.entityId) {
      if (entityType?.entities?.length > 0) {
        const entity = entityType.entities.find(e => e.id === record.entityId);
        if (entity?.name || entity?.title) {
          specificEntityName = entity.name || entity.title;
        }
      }
      const wishlistStatus = wishlistStatusesStore.statuses.find(s => s.id === record.entityId);
      if (wishlistStatus?.name) {
        specificEntityName = wishlistStatus.name;
      }
    }

    if (specificEntityName === entityType?.name) {
      specificEntityName = `${entityType?.name} #${record.entityId?.slice(-8)}`;
    }

    let userName, userAvatar;
    if (record.authorFirstName) {
      userName = `${record.authorFirstName}${record.authorLastName ? ` ${record.authorLastName}` : ''}`;
      userAvatar = record.authorPhotoUrl || null;
    } else if (profileStore.profile?.id === record.userId) {
      userName = `${(profileStore.profile.firstName || profileStore.profile.name || 'Я')}${(profileStore.profile.lastName ? ` ${profileStore.profile.lastName}` : '')}`;
      userAvatar = profileStore.profile.photoUrl || profileStore.profile.avatar || null;
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
      authorEmail: record.authorEmail,
      changesText: formatChanges(record.oldValues, record.newValues),
      timeFormatted: new Date(record.time).toLocaleString('uk-UA', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    };
  });
},

ensureDependenciesLoaded: async () => {
  const profileStore = useProfileStore.getState();
  if (!profileStore.profile) {
    await profileStore.fetchProfile();
  }

  const actionsStore = useActionsStore.getState();
  if (actionsStore.actions.length === 0) {
    await actionsStore.fetchActions();
  }

  const entityTypesStore = useEntityTypesStore.getState();
  if (entityTypesStore.entityTypes.length === 0) {
    await entityTypesStore.fetchEntityTypes();
  }

  const wishlistStatusesStore = useWishlistStatusesStore.getState();
  if (wishlistStatusesStore.statuses.length === 0) {
    await wishlistStatusesStore.fetchStatuses();
  }
},

  fetchHistoryByUser: async (userId) => {
    await get().ensureDependenciesLoaded();

    set({ isLoading: true });

    try {
      const response = await apiClient.get(`/history/by-user/${userId}`);
      const rawData = response.data || [];
      const enrichedData = get().enrichHistory(rawData);

      set({
        history: enrichedData,
        myHistory: []
      });

    } catch (error) {
      console.error('fetchHistoryByUser Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      });
      set({ history: [], myHistory: [] });
    } finally {
      set({ isLoading: false });
    }
  },

 fetchMyHistory: async () => {
  const profileStore = useProfileStore.getState();
  const myUserId = profileStore.profile?.id;

  if (!myUserId){
    return;
  }

  set({ isLoading: true });
  await get().ensureDependenciesLoaded();

  try {
    const response = await apiClient.get('/history/my', {
      params: { userId: myUserId }
    });
    const rawData = response.data || [];
    const enrichedData = get().enrichHistory(rawData);

    set({ myHistory: enrichedData, history: [] });
  } catch (error) {
    console.error(error);
    set({ myHistory: [], history: [] });
  } finally {
    set({ isLoading: false });
  }
},

  fetchHistoryByEntity: async (entityId) => {
    await get().ensureDependenciesLoaded();

    set({ isLoading: true });

    try {
      const response = await apiClient.get(`/history/by-entity/${entityId}`);
      const rawData = response.data || [];
      const enrichedData = get().enrichHistory(rawData);
      set({
        history: enrichedData,
        myHistory: []
      });

    } catch (error) {
      console.error('fetchHistoryByEntity Error:', error.response?.status);
      set({ history: [], myHistory: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHistoryByEntityAndType: async (entityId, entityTypeId) => {
    await get().ensureDependenciesLoaded();

    set({ isLoading: true });

    try {
      const response = await apiClient.get(`/history/by-entity-and-type/${entityId}/${entityTypeId}`);
      const rawData = response.data || [];
      const enrichedData = get().enrichHistory(rawData);

      set({
        history: enrichedData,
        myHistory: []
      });

    } catch (error) {
      console.error('fetchHistoryByEntityAndType Error:', error.response?.status);
      set({ history: [], myHistory: [] });
    } finally {
      set({ isLoading: false });
    }
  },

fetchAllHistory: async () => {
  const { user } = useAuthStore.getState();
  const isLab = user?.roles?.includes(LAB_ROLE_ID) || user?.role === "Lab";

  if (isLab) {
    const { fetchMyHistory } = get();
    return fetchMyHistory();
  }

  await get().ensureDependenciesLoaded();
  set({ isLoading: true });

  try {
    const response = await apiClient.get('/history/all');
    const rawData = response.data || [];
    const enrichedData = get().enrichHistory(rawData);
    set({ history: enrichedData, myHistory: [] });
  } catch (error) {
    console.error('fetchAllHistory Error:', error.response?.status);
    set({ history: [], myHistory: [] });
  } finally {
    set({ isLoading: false });
  }
},
fetchWidgetHistory: async () => {
  const profileStore = useProfileStore.getState();
  const authStore = useAuthStore.getState();
  const currentUser = authStore.user || profileStore.profile;

  const isLab = currentUser?.roles?.includes(LAB_ROLE_ID) ||currentUser?.role === "Lab" ||
                authStore.user?.roles?.includes(LAB_ROLE_ID) ||authStore.user?.role === "Lab";

  if (isLab) {
    return get().fetchMyHistory();
  }
  return get().fetchAllHistory();
},

  addHistoryEntry: async (historyData) => {
    await get().ensureDependenciesLoaded();
    const profileStore = useProfileStore.getState();
    const currentUserId = profileStore.profile?.id;

    if (!currentUserId) {
      throw new Error('Авторизуйтесь для логування!');
    }

    const dataToSend = {
      userId: currentUserId,
      actionId: historyData.actionId,
      entityTypeId: historyData.entityTypeId,
      entityId: historyData.entityId,
      oldValues: historyData.oldValues || '',
      newValues: historyData.newValues || ''
    };

    const response = await apiClient.post('/history', dataToSend);
    const newEntry = get().enrichHistory([response.data])[0];

    set((state) => ({
      history: [newEntry, ...state.history],
      myHistory: currentUserId === newEntry.userId
        ? [newEntry, ...state.myHistory]
        : state.myHistory
    }));

    return newEntry;
  },

  getHistoryCount: () => get().history.length,
  getMyHistoryCount: () => get().myHistory.length,
  isEmpty: () => get().history.length === 0 && get().myHistory.length === 0,
  clearHistory: () => set({ history: [], myHistory: [] }),
  clearMyHistory: () => set({ myHistory: [] })
}));
