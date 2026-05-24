import React, { useEffect, useMemo } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HistoryItemWidget from './HistoryItemWidget';
import { useHistoryStore } from '@store/useHistoryStore';
import { useTheme } from '../../context/useTheme';
import { useAuthStore } from '@store/useAuthStore';

const LAB_ROLE_ID = "bbc9c32e-8c47-43f4-bc68-c29f81754dac";

const HistoryBlock = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { isDarkMode } = useTheme();

  const {
    history,
    myHistory,
    isLoading,
    fetchMyHistory,
    fetchAllHistory
  } = useHistoryStore();

  const darkMode = isDarkMode ?? false;

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

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    if (isLab) {
      fetchMyHistory();
    } else {
      fetchAllHistory();
    }
  }, [isAuthenticated, user, isLab, fetchMyHistory, fetchAllHistory]);

  const sourceHistory = isLab ? myHistory : history;

  const recentHistory = React.useMemo(() =>
    sourceHistory?.slice(0, 4) || [],
    [sourceHistory]
  );

  const handleBlockClick = () => {
    if (!isLoading) {
      navigate('/front-history');
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: darkMode
          ? 'rgba(8, 39, 59, 0.35)'
          : '#08273b',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(8, 39, 59, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        cursor: isLoading ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': !isLoading ? {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 40px rgba(8, 39, 59, 0.6)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
        } : {},
      }}
      onClick={handleBlockClick}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography
          fontSize={18}
          fontWeight={600}
          sx={{
            mb: 2,
            color: 'rgba(255, 255, 255, 0.95)',
            flexShrink: 0
          }}
        >
          Нещодавні зміни
        </Typography>

        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          overflow: 'hidden',
          minHeight: '160px',
          justifyContent: (isLoading || recentHistory.length === 0) ? 'center' : 'flex-start',
          alignItems: (isLoading || recentHistory.length === 0) ? 'center' : 'stretch',
        }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              <CircularProgress size={24} sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              <Typography
                fontSize={14}
                sx={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center' }}
              >
                Завантаження даних...
              </Typography>
            </Box>
          ) : recentHistory.length === 0 ? (
            <Typography
              fontSize={14}
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                textAlign: 'center',
              }}
            >
              Історія порожня
            </Typography>
          ) : (
            recentHistory.map((record) => (
              <HistoryItemWidget key={record.id} record={record} />
            ))
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default HistoryBlock;