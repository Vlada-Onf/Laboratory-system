import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useBackendAuthStore } from '../../store/useBackendAuthStore';
import { useComponentsStore } from '../../store/useComponentsStore';
import { useSearchStore } from '../../store/useSearchStore';

const SyncBackend = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const syncWithBackend = useBackendAuthStore(state => state.syncWithBackend);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      useSearchStore.getState().setSearchData({ components: [], schematics: [] });
      isInitialized.current = false;
      return;
    }

    const initializeAppData = async () => {
      if (isLoaded && isSignedIn && getToken) {
        if (isInitialized.current) return;

        try {
          await syncWithBackend(getToken);

          const componentsStore = useComponentsStore.getState();
          let currentComponents = componentsStore.components;

          if (!currentComponents || currentComponents.length === 0) {
            currentComponents = await componentsStore.fetchComponents();
          }

          useSearchStore.getState().setSearchData({
            components: currentComponents || [],
            schematics: []
          });

          isInitialized.current = true;
        } catch (error) {
          console.error('Помилка синхронізації або завантаження даних пошуку:', error);
        }
      }
    };

    initializeAppData();
  }, [isLoaded, isSignedIn, getToken, syncWithBackend]);

  return null;
};

export default SyncBackend;