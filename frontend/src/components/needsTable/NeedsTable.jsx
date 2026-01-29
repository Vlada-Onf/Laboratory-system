import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import ComponentCell from '../general/ComponentCell';
import UserCell from '../general/UserCell';
import StatusChip from '../general/StatusChip';
import PriorityChip from '../general/ImportanceChip';

const rows = [
  {
    id: 1,
    componentImage: 'https://store.arduino.cc/cdn/shop/files/A000066_03.front_934x700.jpg?v=1727098250',
    componentName: 'Arduino Uno',
    quantity: 3,
    author: { avatar: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dog_Breeds.jpg', name: 'Дарина Дячук', email: 'darina@gmail.com' },
    createdAt: '2026-01-10',
    description: 'Для навчальних лабораторних робіт',
    status: 'В очікуванні',
    reason: 'Недостатня кількість',
    approvedAt: '',
    priority: 'Висока',
  },
  {
    id: 2,
    componentImage: 'https://minicomp.com.ua/image/catalog/upload/3051885-40.jpg',
    componentName: 'Raspberry Pi 4',
    quantity: 2,
    author: { avatar: 'https://headsupfortails.com/cdn/shop/articles/Pomeranian_Dog_Guide_38876a16-d481-41d0-a5d8-4bf26afd2c8f.jpg?v=1754635331', name: 'Владислава Онуфрієнко', email: 'vlaory@gmail.com' },
    createdAt: '2026-01-12',
    description: 'Для курсового проекту',
    status: 'Затверджено',
    reason: 'Необхідно для лабораторії',
    approvedAt: '2026-01-11',
    priority: 'Середня',
  },
  {
    id: 3,
    componentImage: 'https://www.az-delivery.de/cdn/shop/products/esp32-nodemcu-module-wlan-wifi-development-board-mit-cp2102-nachfolgermodell-zum-esp8266-kompatibel-mit-arduino-872375.jpg?v=1679400491',
    componentName: 'ESP32 Dev Kit',
    quantity: 5,
    author: { avatar: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dog_Breeds.jpg', name: 'Дарина Дячук', email: 'darina@gmail.com' },
    createdAt: '2026-01-14',
    description: 'Для IoT проекту',
    status: 'В очікуванні',
    reason: 'Потрібно на лабораторні',
    approvedAt: '',
    priority: 'Висока',
  },
];

const NeedsTable = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  const columns = [
    {
      field: 'component',
      headerName: 'Компонент',
      flex: 2.2,
      renderCell: (params) => (
        <ComponentCell image={params.row.componentImage} name={params.row.componentName} />
      ),
      minWidth: 220
    },
    { field: 'quantity', headerName: 'Кількість', flex: 0.8 ,minWidth: 90},
    { field: 'description', headerName: 'Опис', flex: 2 ,minWidth: 220},
    { field: 'reason', headerName: 'Причина', flex: 2 ,minWidth: 220},
    {
      field: 'priority',
      headerName: 'Важливість',
      flex: 1.1,
      renderCell: (params) => <PriorityChip priority={params.row.priority} />,
      minWidth: 100,
    },
    { field: 'createdAt', headerName: 'Дата запису', flex: 1.2 , minWidth: 120},
    {
      field: 'author',
      headerName: 'Хто додав',
      flex: 2.2,
      renderCell: (params) => <UserCell {...params.row.author} />,
      minWidth: 200,
    },
    {
      field: 'status',
      headerName: 'Статус',
      flex: 1.3,
      renderCell: (params) => <StatusChip status={params.row.status} />,
      minWidth: 120,
    },
    { field: 'approvedAt', headerName: 'Затверджено', flex: 1.2, minWidth: 120 },
  ];

  return (
    <div style={{ height: 580, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowHeight={90}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
        sx={{
        '& .MuiDataGrid-cell': {
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        lineHeight: 1.4,
        },
        '& .MuiDataGrid-columnHeaders': {
        backgroundColor: '#f5f5f5',
        },
    }}
/>
    </div>
  );
};

export default NeedsTable;
