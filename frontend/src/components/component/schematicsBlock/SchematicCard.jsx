import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const SchematicCard = ({ id, title, photoUrl, schematic, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = useCallback((event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleEdit = useCallback(() => {
    handleMenuClose();
    onEdit?.(schematic);
  }, [handleMenuClose, onEdit, schematic]);

  const handleDelete = useCallback(() => {
    handleMenuClose();
    onDelete?.(id, title);
  }, [handleMenuClose, onDelete, id, title]);

  const handleClick = useCallback(() => {
    if (open) {
      handleMenuClose();
      return;
    }
    navigate(`/schematics/${id}`);
  }, [open, handleMenuClose, navigate, id]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: 200,
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s ease-in-out',

        ...(isDarkMode && {
          background: 'linear-gradient(135deg, #08273b, #365468)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          '&:hover': {
            background: 'linear-gradient(135deg, #051926, #20314a)',
            transform: 'translateY(-4px)',
          },
        }),

        ...(!isDarkMode && {
          background: 'linear-gradient(135deg, #f16731, #f4926c)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(135deg, #b74e24, #d07f5e)',
            transform: 'translateY(-4px)',
          },
        }),
      }}
      onClick={handleClick}
    >
      <IconButton
        onClick={handleMenuClick}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          padding: 0.5,
          width: 32,
          height: 32,
          zIndex: 10,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            transform: 'scale(1.1)',
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

      <Box
        component="img"
        src={photoUrl}
        alt={title}
        sx={{
          width: '100%',
          height: 140,
          objectFit: 'cover',
          ...(isDarkMode && { filter: 'brightness(0.8)' }),
          ...(!isDarkMode && { filter: 'brightness(0.85)' }),
        }}
      />
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 1 }}>
        <Typography
          variant="body1"
          fontWeight={500}
          sx={{
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            color: '#fff',
          }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
};

export default React.memo(SchematicCard);
