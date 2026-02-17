import React from 'react';
import { Chip } from '@mui/material';
import { useWishlistStatusesStore } from '@store/useWishlistStatusesStore';



const StatusChip = ({ statusId, onStatusClick }) => {
  const { statuses } = useWishlistStatusesStore();
  const currentStatus = statuses.find(s => s.id === statusId)?.name || 'Невідомий';

  return (
    <Chip
      label={currentStatus}
      onClick={onStatusClick}
      sx={{
        fontWeight: 700,
        cursor: 'pointer',
      }}
      variant="outlined"
    />
  );
};

export default StatusChip;
