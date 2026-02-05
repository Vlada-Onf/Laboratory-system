import React from 'react';
import { Box, Typography } from '@mui/material';
import PageWrapper from '../../components/layout/PaperWrapper';

const Profile = () => {
  return (
    <PageWrapper>
      <Box sx={{ p: 3}}>
        <Typography variant="h4" fontWeight={700}>
          тут профіль користувача
        </Typography>
      </Box>
    </PageWrapper>
  );
};

export default Profile;
