import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

const CategoryCard = ({ title, description, image, color }) => {
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
    </Card>
  );
};


export default CategoryCard;
