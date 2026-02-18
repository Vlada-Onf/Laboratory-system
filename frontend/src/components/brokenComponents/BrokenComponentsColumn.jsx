import React from 'react';
import { Typography } from '@mui/material';
import ComponentCell from './../general/ComponentCell';
import MoveToNeedsButton from './MoveToNeedsButton';

export const brokenComponentsColumns = (handleOpenModal) => [
  {
    field: 'component',
    headerName: 'Компонент',
    flex: 2,
    minWidth: 250,
    sortable: false,
    renderCell: ({ row }) => (
      <ComponentCell
        image={row.component?.photoUrl}
        name={row.component?.name || '—'}
      />
    ),
  },
  {
    field: 'categoryName',
    headerName: 'Категорія',
    flex: 1,
    minWidth: 150,
    renderCell: ({ row }) => (
      <Typography variant="body2" fontWeight={500}>
        {row.categoryName || '—'}
      </Typography>
    ),
  },
  {
    field: 'quantity',
    headerName: 'Кількість',
    flex: 0.8,
    minWidth: 100,
    renderCell: ({ value }) => (
      <Typography fontWeight={600}>
        {value} шт
      </Typography>
    ),
  },
  {
    field: 'reason',
    headerName: 'Причина',
    flex: 1.5,
    minWidth: 180,
    renderCell: ({ row }) => (
      <Typography variant="body2" fontWeight={500}>
        {row.reasonName || '—'}
      </Typography>
    ),
  },
  {
    field: 'lastUpdatedAt',
    headerName: 'Дата оновлення',
    flex: 1,
    minWidth: 140,
    renderCell: ({ row }) => {
      const dateValue = row.lastUpdatedAt || row.recordedAt;

      if (!dateValue){
        return <Typography>—</Typography>;
      }

      const date = new Date(dateValue);
      return (
        <Typography variant="body2" fontWeight={500}>
          {date.toLocaleDateString('uk-UA')} {date.toLocaleTimeString('uk-UA', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Typography>
      );
    },
  },
  {
    field: 'actions',
    headerName: '',
    width: 140,
    sortable: false,
    renderCell: ({ row }) => (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <MoveToNeedsButton
          onMoveToNeeds={() => handleOpenModal(row)}
          label="До потреб"
        />
      </div>
    ),
  },
];
