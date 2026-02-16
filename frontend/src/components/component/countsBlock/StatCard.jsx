import React from 'react';
import Item from './../Item';
import SectionTitle from './../SectionTitle';
import { Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

const StatCard = ({ 
  title, 
  value, 
  bgcolor, 
  titleColor,
  onEdit,
  showEditButton = false
}) => (
  <Item
    sx={{
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      background: bgcolor || '#08273b',
      position: 'relative',
      p: 2
    }}
  >
    <SectionTitle color={titleColor || '#fff'}>{title}</SectionTitle>
    <Typography
      variant="h4"
      fontWeight={600}
      color="#fff"
    >
      {value}
    </Typography>

    {showEditButton && (
      <IconButton
        onClick={onEdit}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: '#fff',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.2)',
          }
        }}
        size="small"
      >
        <EditIcon />
      </IconButton>
    )}
  </Item>
);

export default StatCard;
