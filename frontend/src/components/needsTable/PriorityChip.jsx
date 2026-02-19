import { Chip } from '@mui/material';
import { useNeedImportancesStore } from '@store/useNeedImportancesStore';

const PriorityChip = ({ priorityId, onPriorityClick }) => {
  const { importances } = useNeedImportancesStore();
  
  const priorityName = importances.find(i => i.id === priorityId)?.name || '—';

  return (
    <Chip
      label={priorityName}
      onClick={onPriorityClick}
      sx={{
        fontWeight: 700,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'rgba(25, 118, 210, 0.08)',
        }
      }}
      variant="outlined"
      size="small"
    />
  );
};

export default PriorityChip;
