import React from 'react';
import { Box, Typography } from '@mui/material';
import LinksRow from '../linksBlock/LinksRow';

const SchematicLinksBlock = ({ schematic }) => {
  let links = [];
  
  if (schematic.additionalLinks) {
    if (Array.isArray(schematic.additionalLinks)) {
      links = schematic.additionalLinks;
    } else if (typeof schematic.additionalLinks === 'string') {
      links = schematic.additionalLinks
        .split(',')
        .map(link => link.trim())
        .filter(Boolean);
    }
  } else if (schematic.links && Array.isArray(schematic.links)) {
    links = schematic.links;
  }
  
  const hasLinks = links.length > 0;

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
