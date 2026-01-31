import React from 'react';
import Item from './../Item';
import SectionTitle from './../SectionTitle';
import { Typography } from '@mui/material';

const StatCard = ({ title, value, bgcolor, titleColor }) => (
  <Item
    sx={{
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      background: bgcolor || '#08273b',
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
  </Item>
);

export default StatCard;
