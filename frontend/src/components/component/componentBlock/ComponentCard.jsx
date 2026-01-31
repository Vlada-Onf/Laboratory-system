import React from 'react';
import { Box, Typography, Card, CardMedia } from '@mui/material';
import ComponentInfo from './ComponentInfo';
import Item from './../Item';
import ButtonsPanel from './ButtonsPanel';

const ComponentCard = ({ name, image, description, price, quantity, burntQuantity, category, tags }) => (
  <Item sx={{ width: '100%' }}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        alignItems: { xs: 'center', md: 'flex-start' },

      }}
    >
      <Box
        sx={{
          minWidth: 220,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5,
          flexShrink: 0,
        }}
      >
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ fontWeight: 700, wordBreak: 'break-word' }}
        >
          {name}
        </Typography>
        <Card
          sx={{
            width: 220,
            maxHeight: 200,
            flexShrink: 1,
          }}
        >
          <CardMedia
            component="img"
            image={image}
            alt={name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </Card>
      </Box>

      <Box sx={{ flex: 1, mt: 5 }}>
        <ComponentInfo
          description={description}
          price={price}
          quantity={quantity}
          burntQuantity={burntQuantity}
          category={category}
          tags={tags}
        />
      </Box>
    </Box>

    <ButtonsPanel />
  </Item>
);

export default ComponentCard;
