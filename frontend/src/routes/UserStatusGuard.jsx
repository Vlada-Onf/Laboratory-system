import React, { useEffect, useState } from 'react';
import { useProfileStore } from '@store/useProfileStore';
import Blocked from '../pages/general/Blocked';

const UserStatusGuard = ({ children }) => {
  const { profile, fetchProfile } = useProfileStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        await fetchProfile();
      } catch (error) {
        console.error('Status check failed:', error);
      } finally {
        setIsChecking(false);
      }
    };
    checkStatus();
  }, [fetchProfile]);

  if (isChecking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Перевірка...
      </div>
    );
  }

  if (profile && !profile.isActive) {
    console.log('User BLOCKED → /front-blocked');
    return <Blocked />;
  }

  return children;
};

export default UserStatusGuard;
