import React, { useState, useEffect } from 'react';
import { DataGrid, GridActionsCellItem, } from '@mui/x-data-grid';
import { Box, Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,Button,} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useBackendAuthStore } from '@store/useBackendAuthStore'; 
import { useAdminUsersStore } from '@store/useAdminUsersStore';
import { useRolesStore } from '@store/useRolesStore';
import ActiveSwitch from './ActiveSwitch';
import RoleChip from './RoleChip';
import UserCell from '../general/UserCell';

const UsersTable = () => {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null, userName: '' });

  const { 
    fetchAdminUsers, 
    adminUsers: users, 
    loading: usersLoading,
    deleteUser
  } = useAdminUsersStore();
  
  const { fetchRoles, isLoading: rolesLoading } = useRolesStore();
  const backendUser = useBackendAuthStore((state) => state.backendUser);
  
  const SUPERADMIN_ROLE_ID = 'ab46f228-ee9f-4849-aacd-98780292fee8';
  const hasSuperAdminAccess = backendUser?.roleId === SUPERADMIN_ROLE_ID;
  const CURRENT_USER_ID = '9e490da1-39fd-4063-8f16-b4f36ab8c2c5';

  useEffect(() => {
    if (backendUser && hasSuperAdminAccess) {
      fetchRoles().then(() => fetchAdminUsers());
    }
  }, [backendUser, hasSuperAdminAccess, fetchRoles, fetchAdminUsers]);

  const loading = usersLoading || rolesLoading;

  if (loading) {
    return <div style={{ padding: 20 }}>Завантаження ролей та користувачів...</div>;
  }
  
  if (!hasSuperAdminAccess) {
    return <div style={{ padding: 20, color: 'red' }}>
    </div>;
  }

  const handleDeleteClick = (id, name) => {
    setDeleteDialog({ open: true, userId: id, userName: name });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.userId){
      return;
    }
    
    try {
      await deleteUser(deleteDialog.userId);
      setDeleteDialog({ open: false, userId: null, userName: '' });
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Користувач',
      flex: 2,
      sortable: false,
      renderCell: (params) => (
        <UserCell
          avatar={params.row.photoUrl}
          name={`${params.row.firstName} ${params.row.lastName}`}
          email={params.row.email}
          firstName={params.row.firstName}
          lastName={params.row.lastName}
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
          role={params.row.roleName}
          userId={params.row.id}
          disabled={params.row.id === CURRENT_USER_ID}
        />
      ),
      minWidth: 120
    },
   {
  field: 'lastActivityAt', 
  headerName: 'Остання активність', 
  flex: 2,
  minWidth: 170,
  valueFormatter: (value) => {
    if (!value) return 'Немає даних';

    const utcDate = new Date(value);
    
    if (isNaN(utcDate.getTime())) {
      return 'Немає даних';
    }

    return utcDate.toLocaleString('uk-UA', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'short'
    });
  }
},

    { 
      field: 'createdAt', 
      headerName: 'Дата реєстрації', 
      flex: 2,
      valueFormatter: (value) => new Date(value).toLocaleDateString('uk-UA'),
      minWidth: 150
    },
    {
      field: 'active',
      headerName: 'Заблоковано',
      flex: 1,
      renderCell: (params) => (
        <ActiveSwitch
      active={!!params.row.isActive}
      userId={params.row.id}
      disabled={params.row.id === CURRENT_USER_ID}
    />
      ),
      minWidth: 100
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Дії',
      flex: 0.5,
      minWidth: 80,
      getActions: (params) => [
        !(params.row.id === CURRENT_USER_ID) && (
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Видалити"
            onClick={() => handleDeleteClick(
              params.row.id, 
              `${params.row.firstName} ${params.row.lastName}`
            )}
            color="error"
            disabled={usersLoading}
            showInMenu={false}
          />
        )
      ]
    }
  ];

  return (
    <>
      <Box sx={{ height: 570, width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          loading={loading}
          getRowId={(row) => row.id}
          sx={{ 
            '& .MuiDataGrid-cell[data-field="actions"]': {
              justifyContent: 'center'
            }
          }}
        />
      </Box>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
      >
        <DialogTitle>
          Видалити користувача?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ви впевнені, що хочете видалити <strong>{deleteDialog.userName}</strong>?
            <br />Ця дія не може бути скасована.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}
          >
            Скасувати
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            disabled={usersLoading}
          >
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UsersTable;
