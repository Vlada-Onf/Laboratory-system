import React, { useState } from 'react';
import {
  Box, Typography, Card, CardMedia,
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import ComponentInfo from './ComponentInfo';
import Item from './../Item';
import ButtonsPanel from './ButtonsPanel';

const ComponentCard = ({
   sx, id, name, image, description, price, quantity, 
  burntQuantity, categoryId, category, tagIds,tags,
  onEdit, onDelete, onAddNeed
}) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const componentData = {
    id,
    name,
    image,
    description,
    price,
    quantity,
    burntQuantity,
    categoryId,
    category,
  };

  const handleEdit = () => {
    onEdit(componentData);
  };

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(id);
    setDeleteConfirmOpen(false);
  };

  return (
    <>
      <Item sx={{
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    ...sx
  }}>
        <Box sx={{
  display: 'flex',
  flex: 1,
  height: '100%',
  flexDirection: { xs: 'column', md: 'row' },
  gap: 3,
  alignItems: { xs: 'center', md: 'flex-start' }
}}>
          <Box sx={{ minWidth: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            <Typography variant="h6" textAlign="center" sx={{ fontWeight: 700, wordBreak: 'break-word' }}>
              {name}
            </Typography>
            <Card sx={{ width: 220, maxHeight: 200, flexShrink: 1 }}>
              <CardMedia
                component="img"
                image={image}
                alt={name}
                sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Card>
          </Box>

          <Box sx={{ flex: 1, mt: 5 }}>
            <ComponentInfo
              description={description}
              price={price}
              quantity={quantity}
              burntQuantity={burntQuantity}
              categoryId={categoryId}
              category={category}
              tags={tags}
              tagIds={tagIds}
            />
          </Box>
        </Box>

        <ButtonsPanel
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onAddNeed={onAddNeed}
        />
      </Item>

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
    </>
  );
};

export default ComponentCard;
