import { useAuth } from '@clerk/clerk-react';
import { useBackendAuthStore } from '../../store/useBackendAuthStore';
import { useEffect } from 'react';

const SyncBackend = () => {
  const { isLoaded, isSignedIn, getToken, user } = useAuth();
  const syncWithBackend = useBackendAuthStore(state => state.syncWithBackend);

  useEffect(() => {
  console.log('isLoaded:', isLoaded);
  console.log('isSignedIn:', isSignedIn);
  console.log('user:', user?.firstName || user?.id || 'Гість');
  console.log('getToken:', Boolean(getToken));
  
  if (isLoaded && isSignedIn && getToken) {
    syncWithBackend(getToken);
  }
}, [isLoaded, isSignedIn, getToken, syncWithBackend, user?.id]);
  return null;
};


export default SyncBackend;
