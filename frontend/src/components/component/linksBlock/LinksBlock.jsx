import React from 'react';
import { Box } from '@mui/material';
import LinksRow from './LinksRow';
import { componentsMock } from '../../../mock/componentsMock';

const LinksBlock = ({ componentId = 1 }) => {
  const component = componentsMock.find((c) => {
    return c.id === componentId;
  });

  if (!component) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {component.docLink && (
        <LinksRow
          title="Документація"
          links={[component.docLink]}
          color="#08273b"
        />
      )}

      {component.buyLink && (
        <LinksRow
          title="Купити"
          links={[component.buyLink]}
          color="#5bc522"
        />
      )}

      {component.otherLinks?.length > 0 && (
        <LinksRow
          title="Інші посилання"
          links={component.otherLinks}
          color="#f16731"
        />
      )}
    </Box>
  );
};

export default LinksBlock;
