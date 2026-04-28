import { useEffect, useMemo, useRef, useCallback } from 'react';
import { Box, Typography, CircularProgress, Pagination } from '@mui/material';
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
  const topRef = useRef(null);

  const {
    history,
    myHistory,
    isLoading: storeLoading,
    page,
    hasMore,
    fetchAllHistory,
    fetchMyHistory,
    fetchHistoryByUser,
    fetchHistoryByEntity,
    fetchHistoryByEntityAndType
  } = useHistoryStore();

  const isLab = useMemo(() => {
    if (!user) return false;
    const roles = [user.roleId, ...(user.roles || [])];
    return roles.includes(LAB_ROLE_ID) || user.role === 'Lab';
  }, [user]);

  const effectiveType = isLab ? 'my' : type;
  const displayHistory = effectiveType === 'my' ? myHistory : history;
  const isLoading = externalLoading || storeLoading;

  const loadPage = useCallback((targetPage, isReset = true) => {
    if (!isAuthenticated || !user) return;

    const args = [isReset, targetPage];

    switch (effectiveType) {
      case 'my':
        fetchMyHistory(...args);
        break;
      case 'all':
        if (!isLab) fetchAllHistory(...args);
        break;
      case 'user':
        if (!isLab && userId) fetchHistoryByUser(userId, ...args);
        break;
      case 'entity':
        if (!isLab) {
          if (entityId && entityTypeId) fetchHistoryByEntityAndType(entityId, entityTypeId, ...args);
          else if (entityId) fetchHistoryByEntity(entityId, ...args);
        }
        break;
      default:
        if (isLab) fetchMyHistory(...args);
        else fetchAllHistory(...args);
    }
  }, [
    isAuthenticated, user, effectiveType, isLab, userId, entityId, entityTypeId,
    fetchMyHistory, fetchAllHistory, fetchHistoryByUser, fetchHistoryByEntity, fetchHistoryByEntityAndType
  ]);

  useEffect(() => {
    loadPage(1, true);
  }, [loadPage]);

  const handlePageChange = (event, value) => {
    loadPage(value, true);

    setTimeout(() => {
      if (topRef.current) {
        topRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 50);
  };

  if (isLoading && displayHistory.length === 0) {
    return (
      <Box sx={{ p: 5, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        ref={topRef}
        sx={{
          position: 'absolute',
          top: -120,
          left: 0,
          visibility: 'hidden'
        }}
      />

      <Box sx={{ minHeight: '400px' }}>
        {displayHistory.map((record) => (
          <HistoryItem key={record.id} record={record} />
        ))}

        {!isLoading && displayHistory.length === 0 && (
          <Typography sx={{ textAlign: 'center', py: 5 }} color="text.secondary">
            {effectiveType === 'my' ? 'Ваша історія порожня' : 'Історія змін порожня'}
          </Typography>
        )}
      </Box>

      {(displayHistory.length > 0 || page > 1) && (
        <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={hasMore ? page + 1 : page}
            page={page}
            onChange={handlePageChange}
            color="primary"
            disabled={isLoading}
            hideNextButton={!hasMore}
          />
        </Box>
      )}
    </Box>
  );
};

export default HistoryList;