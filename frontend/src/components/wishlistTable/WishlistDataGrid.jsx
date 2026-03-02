import { DataGrid } from '@mui/x-data-grid';
import { Box} from '@mui/material';

const WishlistDataGrid = ({
  wishlistRows,
  columns,
  paginationModel,
  onPaginationModelChange,
  isLoading,
}) => {
  return (
    <Box sx={{ height: 510, width: '100%' }}>
      <DataGrid
        rows={wishlistRows}
        getRowId={(row) => row.id}
        columns={columns}
        loading={isLoading}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[10, 20]}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            lineHeight: 1.4,
          },
        }}
      />
    </Box>
  );
};

export default WishlistDataGrid;
