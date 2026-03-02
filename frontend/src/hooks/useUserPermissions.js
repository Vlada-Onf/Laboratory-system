import { useAuthStore } from '@store/useAuthStore';
import { useMemo } from 'react';

const LAB_ROLE_ID = 'bbc9c32e-8c47-43f4-bc68-c29f81754dac';

export const useUserPermissions = () => {
  const { user } = useAuthStore();

  return useMemo(() => {
    const roles = [];
    if (user?.roleId){
      roles.push(user.roleId);
    }

    if (user?.roles?.length){
      roles.push(...user.roles);
    }
    const allRoles = [...new Set(roles)];
    const isLab = allRoles.includes(LAB_ROLE_ID);
    const canSeeToolbar = !isLab;
    return { isLab, canSeeToolbar };
  }, [user]);
};
