import React from 'react';
import { Box, Typography } from '@mui/material';
import LinksRow from '../linksBlock/LinksRow';

const SchematicLinksBlock = ({ schematic }) => {
  const links = schematic.links || schematic.additionalLinks || [];
  const hasLinks = Array.isArray(links) && links.length > 0;

  if (!hasLinks) {
    return (
      <Box sx={{ mt: 3, p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Посилань немає
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>

      <LinksRow
        title="Корисні посилання"
        links={links}
        color="#1976d2"
      />
    </Box>
  );
};

export default SchematicLinksBlock;
