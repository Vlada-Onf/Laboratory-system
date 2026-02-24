import { useAuth, useUser } from '@clerk/clerk-react';
import { useAuthStore } from '../store/authStore';
import { useEffect, useRef } from 'react';

export const useAuthSync = () => {
  const { getToken } = useAuth();
  const { user, isLoaded, isSignedIn } = useUser();
  const syncWithBackend = useAuthStore(state => state.syncWithBackend);
  const hasSynced = useRef(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !hasSynced.current) {
      console.log('User logged in:', user.id);
      
      const syncOnce = async () => {
        try {
          await syncWithBackend(getToken);
          hasSynced.current = true;
        } catch (error) {
          console.error('Auth sync failed:', error);
        }
      };
      
      syncOnce();
    }
  }, [isLoaded, isSignedIn, user?.id]);
};
