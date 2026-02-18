import React from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PriorityChip from './PriorityChip';
import StatusChip from './StatusChip';

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
