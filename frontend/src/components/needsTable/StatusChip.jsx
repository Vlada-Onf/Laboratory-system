import { Chip } from '@mui/material';
import { useNeedStatusesStore } from '@store/useNeedStatusesStore';

const StatusChip = ({ statusId }) => {
  const { statuses } = useNeedStatusesStore();

  const currentStatus = statuses.find(s => s.id === statusId)?.name || 'Невідомий';

  return (
    <Chip label={currentStatus}
      sx={{ fontWeight: 700,}}
      variant="outlined"
      size="small"
    />
  );
};

export default StatusChip;
