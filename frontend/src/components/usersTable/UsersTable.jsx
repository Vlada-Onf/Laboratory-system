// components/users/UsersTable.js
import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Avatar, Box, Typography, Chip } from '@mui/material';
import UserCell from '../general/UserCell';
import ActiveSwitch from './ActiveSwitch';
import RoleChip from './RoleChip';

const rows = [
  {
    id: 1,
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dog_Breeds.jpg',
    name: 'Дарина Дячук',
    email: 'darina@gmail.com',
    role: 'Admin',
    active: true,
    lastActivity: '2026-01-08 18:00',
    createdAt: '2025-03-25',
  },
  {
    id: 2,
    avatar: 'https://headsupfortails.com/cdn/shop/articles/Pomeranian_Dog_Guide_38876a16-d481-41d0-a5d8-4bf26afd2c8f.jpg?v=1754635331',
    name: 'Владислава Онуфрієнко',
    email: 'vlaory@gmail.com',
    role: 'Lab',
    active: false,
    lastActivity: '2026-01-07 12:30',
    createdAt: '2025-04-01',
  },
];

const UsersTable = () => {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const columns = [
  {
    field: 'name',
    headerName: 'Користувач',
    flex: 2,
    sortable: false,
    renderCell: (params) => (
      <UserCell
        avatar={params.row.avatar}
        name={params.row.name}
        email={params.row.email}
      />
    ),
    minWidth: 270
  },
  {
    field: 'role',
    headerName: 'Роль',
    flex: 1,
    renderCell: (params) => (
      <RoleChip
        role={params.row.role}
        onChange={(newRole) => console.log(params.row.id, 'new role:', newRole)}
      />
    ),
    minWidth: 100
  },
  { field: 'lastActivity', headerName: 'Остання активність', flex: 2 ,minWidth: 170},
  { field: 'createdAt', headerName: 'Дата реєстрації', flex: 2 , minWidth: 150},
  {
    field: 'active',
    headerName: 'Активність',
    flex: 1,
    renderCell: (params) => (
      <ActiveSwitch
        active={params.row.active}
        onChange={(newValue) => console.log(params.row.id, 'active changed to', newValue)}
      />
    ),
    minWidth: 100
  },
];


  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default UsersTable;
