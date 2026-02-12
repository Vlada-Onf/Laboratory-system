import React, { useState } from 'react';
import {Card, CardContent, CardMedia, Typography, IconButton, Menu, MenuItem,} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { eventBus } from '../../utils/eventBus';
import AddCategoryModal from './AddCategoryModal';

const CategoryCard = ({ title, description, image, color, id, onEditCategory, onDeleteCategory }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleEditSubmit = (updatedCategory) => {
    onEditCategory(updatedCategory);
    handleEditClose();
  };

  const handleDelete = () => {
    handleMenuClose();

    eventBus.emit('entity:deleted', {
      userId: 'currentUser',
      userName: 'Дарина',
      actionName: 'Видалено',
      entityTypeId: 1,
      entityTypeName: 'Категорію',
      entityId: id,
      entityName: title
    });

    if (onDeleteCategory) {
      onDeleteCategory(id);
    }
  };
  return (
    <Card
      sx={{
        width: 300,
        height: 240,
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
        overflow: 'hidden',
        background: `linear-gradient(
          90deg,
          ${color} 0%,
          ${color}CC 70%
        )`,
        position: 'relative',
        borderRadius: 2,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardMedia
        component="div"
        sx={{
          height: 120,
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <IconButton
        onClick={handleMenuClick}
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          color: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          padding: 0.5,
          width: 28,
          height: 28,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Редагувати</MenuItem>
        <MenuItem onClick={handleDelete}>Видалити</MenuItem>
      </Menu>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom noWrap>
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </Typography>
      </CardContent>

      <AddCategoryModal
        open={editOpen}
        onClose={handleEditClose}
        onAdd={() => {}}
        onEdit={handleEditSubmit}
        category={{
          id,
          title,
          description,
          image,
          color,
        }}
      />
    </Card>
  );
};

export default CategoryCard;
