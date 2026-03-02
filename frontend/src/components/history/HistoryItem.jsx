import React from 'react';
import { Box, Typography, Avatar, Card, CardContent, Divider } from '@mui/material';
import { useEntityTypesStore } from '@store/useEntityTypesStore';
import { useActionsStore } from '@store/useActionsStore';
import EntityChips from './EntityChips';
import ChangeList from './ChangeList';

const HistoryItem = ({ record }) => {
  const { entityTypes } = useEntityTypesStore();
  const { actions } = useActionsStore();

  return (
    <Card sx={{ mb: 2, boxShadow: 1 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            src={record.userAvatar}
            alt={record.userName}
            sx={{ mr: 2, width: 40, height: 40 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
              {record.userName || 'Невідомий користувач'}
            </Typography>

            <EntityChips
              record={record}
              entityTypes={entityTypes}
              actions={actions}
              entityName={record.entityName}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <ChangeList record={record} entityTypes={entityTypes} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {record.time ? new Date(record.time).toLocaleString('uk-UA') : 'невідомо'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HistoryItem;
