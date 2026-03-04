import { Card, CardContent, CardMedia, Box, Typography } from '@mui/material';
import AddCategoryModal from './AddCategoryModal';
import CategoryCardMenu from './CategoryCardMenu';
import { useCategoryCardActions } from '../../hooks/categories/useCategoryCardActions';

const CategoryCard = ({
  name, description, cardColor, id, image, onEditCategory, onDeleteCategory, onCategoryClick, isLabRole = false
}) => {
  const {
    anchorEl, editOpen, open, handleCardClick, handleMenuClick, handleMenuButtonEvents,
    handleMenuClose, handleEdit, handleDelete, handleEditSubmit, handleEditClose
  } = useCategoryCardActions({
    id, name, description, cardColor,
    onEditCategory, onDeleteCategory, onCategoryClick
  });

  const finalImage = image || null;
  const showMenu = !isLabRole;
  const showEditModal = !isLabRole && editOpen;

  return (
    <>
      <Card
        onClick={onCategoryClick ? handleCardClick : undefined}
        sx={{
          width: { xs: 260, sm: 300 },
          height: { xs: 230, sm: 240 },
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', position: 'relative',
          borderRadius: 2, transition: 'all 0.3s ease-in-out',
          cursor: onCategoryClick ? 'pointer' : 'default',
          color: '#fff',
          background: cardColor,
        }}
      >
        {finalImage ? (
          <CardMedia
            component="img"
            src={finalImage}
            alt={name}
            sx={{height: 120, objectFit: 'cover', position: 'relative'}}
          />
        ) : (
          <Box
            sx={{height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '16px 16px 0 0', position: 'relative' }}
          />
        )}

        {showMenu && (
          <CategoryCardMenu
            anchorEl={anchorEl}
            open={open}
            handleMenuClick={handleMenuClick}
            handleMenuButtonEvents={handleMenuButtonEvents}
            handleMenuClose={handleMenuClose}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        )}

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, lineHeight: 1.2 }}>{name}</Typography>
          <Typography
            variant="body2"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              opacity: 0.9,
              lineHeight: 1.4
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </Card>

      {showEditModal && (
        <AddCategoryModal
          open={editOpen}
          onClose={handleEditClose}
          onEdit={handleEditSubmit}
          category={{
            id,
            name,
            description,
            image: finalImage || '',
            color: cardColor
          }}
          onAdd={() => {}}
        />
      )}
    </>
  );
};

export default CategoryCard;
