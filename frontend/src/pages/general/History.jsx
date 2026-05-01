import { useState, useMemo, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import PageWrapper from '../../components/layout/PaperWrapper';
import HistoryList from '../../components/history/HistoryList';
import HistoryFilters from '../../components/history/HistoryFilters';
import { useAuthStore } from '@store/useAuthStore';
import { useEntityTypesStore } from '@store/useEntityTypesStore';
import apiClient from '../../api/client';

const LAB_ROLE_ID = "bbc9c32e-8c47-43f4-bc68-c29f81754dac";

const History = () => {
  const { user } = useAuthStore();
  const { entityTypes, fetchEntityTypes } = useEntityTypesStore();

  const isLab = useMemo(() => {
    return user?.role === 'Lab' || user?.roleId === LAB_ROLE_ID;
  }, [user]);

  const [historyType, setHistoryType] = useState(isLab ? 'my' : 'all');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedEntityTypeId, setSelectedEntityTypeId] = useState(null);
  const [selectedEntityId, setSelectedEntityId] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (entityTypes.length === 0) fetchEntityTypes();

    const loadUsers = async () => {
      try {
        const response = await apiClient.get('/users');
        setUsers(response.data || []);
      } catch (err) {
        console.error("Error loading users:", err);
      }
    };

    if (!isLab) {
      loadUsers();
    }
  }, [entityTypes.length, fetchEntityTypes, isLab]);

  const handleTabChange = (newType) => {
    if (isLab && newType !== 'my') return;

    setHistoryType(newType);
    setSelectedUserId(null);
    setSelectedEntityTypeId(null);
    setSelectedEntityId(null);
  };

  const handleTypeChange = (typeId) => {
    setSelectedEntityTypeId(typeId);
    setSelectedEntityId(null);
  };

  const isFilterIncomplete = useMemo(() => {
    if (isLab) return false;
    if (historyType === 'user' && !selectedUserId) return true;
    if (historyType === 'entity' && !selectedEntityTypeId) return true;
    if (historyType === 'single-entity' && !selectedEntityId) return true;
    return false;
  }, [historyType, selectedUserId, selectedEntityTypeId, selectedEntityId, isLab]);

  return (
    <PageWrapper>
      <Box sx={{ p: 3, width: '100%' }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {isLab ? "Моя історія дій" : "Історія змін в системі"}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <HistoryFilters
            currentTab={historyType}
            onTabChange={handleTabChange}
            isLab={isLab}
            users={users}
            entityTypes={entityTypes}
            selectedEntityTypeId={selectedEntityTypeId}
            selectedEntityId={selectedEntityId}
            onUserSelectUser={setSelectedUserId}
            onEntityTypeSelect={handleTypeChange}
            onEntitySelect={setSelectedEntityId}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          {isFilterIncomplete ? (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              {historyType === 'user'
                ? "Оберіть користувача."
                : "Оберіть категорію для перегляду історії."}
            </Alert>
          ) : (
            <HistoryList
              type={isLab ? 'my' : historyType}
              userId={isLab ? user?.id : selectedUserId}
              entityId={selectedEntityId || selectedEntityTypeId}
              entityTypeId={selectedEntityId ? selectedEntityTypeId : null}
            />
          )}
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default History;