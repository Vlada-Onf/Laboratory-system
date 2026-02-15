import React, { useState, useCallback } from 'react';
import {
  Card, CardContent, Box, Typography, IconButton, Menu, MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { eventBus } from '../../utils/eventBus';
import AddCategoryModal from './AddCategoryModal';

const CategoryCard = ({ 
  title, 
  description, 
  color, 
  id, 
  onEditCategory, 
  onDeleteCategory 
}) => {
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

  const handleEditSubmit = useCallback((updatedCategory) => {
    const dataForStore = {
      name: updatedCategory.name || title,
      description: updatedCategory.description || description,
      photoUrl: '',
      cardColor: updatedCategory.cardColor || color 
    };

    onEditCategory(id, dataForStore);
    handleEditClose();
  }, [id, title, description, color, onEditCategory]);

  const handleDelete = useCallback(() => {
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
    onDeleteCategory?.(id);
  }, [id, title, onDeleteCategory]);

  return (
    <Card sx={{
      width: 300,
      height: 240,
      display: 'flex',
      flexDirection: 'column',
      color: '#fff',
      overflow: 'hidden',
      background: `linear-gradient(135deg, ${color} 0%, ${color}E6 100%)`,
      position: 'relative',
      borderRadius: 2,
      transition: 'all 0.3s ease-in-out',
      '&:hover': { 
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.3)'
      },
    }}>
      <Box
        sx={{
          height: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `${color}40`,
          position: 'relative',
          borderRadius: '16px 16px 0 0'
        }}
      />

      <IconButton
        onClick={handleMenuClick}
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          color: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          padding: 0.5,
          width: 32,
          height: 32,
          '&:hover': { 
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            transform: 'scale(1.1)'
          },
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>Редагувати</MenuItem>
        <MenuItem onClick={handleDelete}>Видалити</MenuItem>
      </Menu>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            lineHeight: 1.2
          }}
        >
          {title}
        </Typography>
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

      <AddCategoryModal
        open={editOpen}
        onClose={handleEditClose}
        onAdd={() => {}}
        onEdit={handleEditSubmit}
        category={{ 
    id, 
    title,
    description, 
    image: '',
    color
  }}
      />
    </Card>
  );
};

export default CategoryCard;
