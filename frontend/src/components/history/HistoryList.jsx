import { useEffect, useMemo } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import HistoryItem from './HistoryItem';
import { useHistoryStore } from '@store/useHistoryStore';
import { useAuthStore } from '@store/useAuthStore';

const LAB_ROLE_ID = "bbc9c32e-8c47-43f4-bc68-c29f81754dac";

const HistoryList = ({
  entityId,
  entityTypeId,
  userId,
  type = 'all',
  isLoading: externalLoading = false
}) => {
  const { user, isAuthenticated } = useAuthStore();

  const {
    history,
    myHistory,
    isLoading: storeLoading,
    fetchHistoryByEntity,
    fetchHistoryByEntityAndType,
    fetchMyHistory,
    fetchHistoryByUser,
    fetchAllHistory
  } = useHistoryStore();

  const isLab = useMemo(() => {
    if (!user){
      return false;
    }

    const roles = [];
    if (user.roleId){
      roles.push(user.roleId);
    }
    if (user.roles && Array.isArray(user.roles)){
      roles.push(...user.roles);
    }

    return roles.includes(LAB_ROLE_ID) || user.role === 'Lab';
  }, [user]);

  const effectiveType = isLab ? 'my' : type;
  const displayHistory = effectiveType === 'my' ? myHistory : history;
  const isLoading = externalLoading || storeLoading;

 useEffect(() => {
  if (!isAuthenticated || !user) {
    console.warn('Пропускаємо fetch, користувач відсутній');
    return;
  }

  let loadFn = null;

  switch (effectiveType) {
    case 'my':
      loadFn = fetchMyHistory;
      break;

    case 'all':
      if (!isLab) loadFn = fetchAllHistory;
      break;

    case 'user':
      if (!isLab && userId) loadFn = () => fetchHistoryByUser(userId);
      break;

    case 'entity':
      if (!isLab) {
        if (entityId && entityTypeId) loadFn = () => fetchHistoryByEntityAndType(entityId, entityTypeId);
        else if (entityId) loadFn = () => fetchHistoryByEntity(entityId);
      }
      break;

    default:
      loadFn = isLab ? fetchMyHistory : fetchAllHistory;
  }

  if (loadFn) {
    loadFn();
  }
}, [
  effectiveType,
  entityId,
  entityTypeId,
  userId,
  isAuthenticated,
  user,
  isLab,
  fetchMyHistory,
  fetchAllHistory,
  fetchHistoryByUser,
  fetchHistoryByEntity,
  fetchHistoryByEntityAndType
]);

  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
          Завантаження історії...
        </Typography>
      </Box>
    );
  }

  if (!displayHistory || displayHistory.length === 0) {
    console.log('displayHistory порожній');
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          {effectiveType === 'my'
            ? 'Ваша історія поки порожня'
            : 'Історія змін порожня'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {displayHistory.map((record) => (
        <HistoryItem key={record.id} record={record} />
      ))}
    </Box>
  );
};

export default HistoryList;