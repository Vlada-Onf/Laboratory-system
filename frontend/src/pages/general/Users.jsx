import React from 'react';
import { Box, Typography } from '@mui/material';
import UsersTable from '../../components/usersTable/UsersTable';

const Users = () => {
  return (
    <Box p={3}>
      <UsersTable />
    </Box>
  );
};

export default Users;
