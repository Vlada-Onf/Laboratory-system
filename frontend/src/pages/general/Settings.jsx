import { Box } from '@mui/material';
import PageWrapper from '../../components/layout/PaperWrapper';
import SettingsLayout from '../../components/settings/SettingsLayout';

const Setings = () => {
  return (
    <PageWrapper>
      <Box sx={{ p: 3}}>
        <SettingsLayout>
      </SettingsLayout>
      </Box>
    </PageWrapper>
  );
};

export default Setings;
