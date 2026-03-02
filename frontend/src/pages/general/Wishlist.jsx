import { Box, Typography } from '@mui/material';
import WishlistTable from '../../components/wishlistTable/WishlistTable';
import { useNeedsStore } from '../../store/useNeedsStore';
import PageWrapper from '../../components/layout/PaperWrapper';

const Wishlist = () => {
  const addNeed = useNeedsStore((state) => state.addNeed);

  return (
    <PageWrapper>
      <Box sx={{ p: 2}}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          Список бажаного
        </Typography>

        <WishlistTable onAddNeed={addNeed} />
      </Box>
    </PageWrapper>
  );
};

export default Wishlist;
