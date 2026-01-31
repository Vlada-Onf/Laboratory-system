import React from 'react';
import { Box } from '@mui/material';
import SchematicCard from './SchematicCard';
import { schematicsMock } from './../../../mock/schematicsMock';

const SchematicsBlock = () => (
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 2,
      justifyContent: {
        xs: 'center',
        sm: 'space-between',
      },
    }}
  >
    {schematicsMock.map((schematic) => (
      <Box
        key={schematic.id}
        sx={{
          flex: '1 1 300px',
          maxWidth: 333,
        }}
      >
        <SchematicCard
          name={schematic.name}
          image={schematic.image}
          link={schematic.link}
        />
      </Box>
    ))}
  </Box>
);

export default SchematicsBlock;
