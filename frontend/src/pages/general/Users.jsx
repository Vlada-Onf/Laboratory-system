import { Box } from '@mui/material';
import UsersTable from '../../components/usersTable/UsersTable';
import PageWrapper from '../../components/layout/PaperWrapper';

const Users = () => {
  return (
    <PageWrapper>
      <Box sx={{ p: 3 }}>
        <UsersTable />
      </Box>
    </PageWrapper>
  );
};

export default Users;
