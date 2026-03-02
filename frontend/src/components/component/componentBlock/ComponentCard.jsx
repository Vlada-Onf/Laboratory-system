import { useState } from 'react';
import { Box, Typography, Card, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useAuthStore } from '../../../store/useAuthStore';
import ComponentInfo from './ComponentInfo';
import Item from './../Item';
import ButtonsPanel from './ButtonsPanel';

const LAB_ROLE_ID = 'bbc9c32e-8c47-43f4-bc68-c29f81754dac';

const ComponentCard = ({
  sx, id, name, image, photoUrl, description, price, quantity,
  burntQuantity, categoryId, category, tagIds, tags,
  onEdit, onDelete, onAddNeed
}) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const { user } = useAuthStore();
  const getUserRoles = () => {
    const roles = [];
    if (user?.roleId) roles.push(user.roleId);
    if (user?.roles && Array.isArray(user.roles)) roles.push(...user.roles);
    return [...new Set(roles)];
  };
  const userRoles = getUserRoles();
  const isLabRole = userRoles.includes(LAB_ROLE_ID);


  const finalImage = image ||
                     photoUrl ||
                     'https://via.placeholder.com/350x350/08273b/ffffff?text=No+Image';

  const componentData = {
    id,
    name,
    image: finalImage,
    description,
    price,
    quantity,
    burntQuantity,
    categoryId,
    category,
  };

  const handleEdit = isLabRole ? () => {
    console.log('Лаборант не може редагувати');
  } : () => {
    onEdit(componentData);
  };

  const handleDeleteClick = isLabRole ? () => {
    console.log('Лаборант не може видаляти');
  } : () => {
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!isLabRole && onDelete) {
      onDelete(id);
    }
    setDeleteConfirmOpen(false);
  };

  const buttonsPanelProps = {
    onEdit: handleEdit,
    onDelete: handleDeleteClick,
    onAddNeed,
    isLabRole
  };

  const photoBoxSx = {
    minWidth: isLabRole ? 380 : 220,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    flexShrink: 0
  };

  const photoCardSx = {
    width: isLabRole ? 380 : 220,
    maxHeight: isLabRole ? 340 : 200,
    flexShrink: 1
  };

  const photoMediaSx = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    backgroundColor: '#f5f5f5'
  };

  const infoBoxSx = {
    flex: 1,
    mt: isLabRole ? 6 : 5,
    fontSizeBoost: isLabRole ? 1.6 : 1
  };

  return (
    <>
      <Item sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', ...sx}}>
        <Box sx={{
          display: 'flex',
          flex: 1,
          height: '100%',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: isLabRole ? 5 : 3,
          alignItems: { xs: 'center', lg: 'flex-start' }
        }}>
          <Box sx={photoBoxSx}>
            <Typography
              variant={isLabRole ? "h5" : "h6"}
              textAlign="center"
              sx={{
                fontWeight: 800,
                wordBreak: 'break-word',
                fontSize: isLabRole ? '2rem' : '1.25rem',
                lineHeight: 1.2,
                mb: 2
              }}
            >
              {name}
            </Typography>

            <Card sx={photoCardSx}>
              <CardMedia
                component="img"
                image={finalImage}
                alt={name}
                sx={photoMediaSx}
              />
            </Card>
          </Box>

          <Box sx={infoBoxSx}>
            <ComponentInfo
              description={description}
              price={price}
              quantity={quantity}
              burntQuantity={burntQuantity}
              categoryId={categoryId}
              category={category}
              tags={tags}
              tagIds={tagIds}
              fontSizeBoost={isLabRole ? 1.8 : 1}
              isLabRole={isLabRole}
            />
          </Box>
        </Box>

        <ButtonsPanel {...buttonsPanelProps} />
      </Item>

      {!isLabRole && (
        <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
          <DialogTitle>Підтвердити видалення</DialogTitle>
          <DialogContent>
            Ви впевнені, що хочете видалити компонент "<strong>{name}</strong>"?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Скасувати</Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error">
              Видалити
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default ComponentCard;
