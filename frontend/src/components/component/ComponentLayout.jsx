import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import ComponentCard from './componentBlock/ComponentCard';
import Item from './Item';
import SectionTitle from './SectionTitle';
import StatCard from './countsBlock/StatCard';
import LinksBlock from './linksBlock/LinksBlock';
import SchematicsBlock from './schematicsBlock/SchematicsBlock';
import CommentsBlock from './commentsBlock/CommentsBlock';


const ComponentLayout = ({
  component,
  onEdit,
  onDelete,
  onUpdateLinks,
  onAddNeed 
}) => {
  const {
    quantity, burntQuantity,
  } = component;

  const totalValue = useMemo(() => `${quantity} шт`, [quantity]);
  const burntValue = useMemo(() => `${burntQuantity || 0} шт`, [burntQuantity]);
  const burntBg = useMemo(() =>
    burntQuantity <= 0
      ? 'linear-gradient(135deg, #5bc522, #a8e063)'
      : 'linear-gradient(135deg, #f16731, #f4926c)',
  [burntQuantity]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', p: 2 }}>
      <Box sx={{
  display: 'flex',
  flexDirection: { xs: 'column', lg: 'row' },
  alignItems: 'stretch',
  gap: 2,
  width: '100%',
}}>
  <Box sx={{ flex: 1 }}>
    <ComponentCard
      sx={{ height: '100%' }}
      {...component}
      onEdit={onEdit}
      onDelete={onDelete}
      onAddNeed={onAddNeed}
    />
  </Box>
  <Box sx={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  }}>
    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
      <StatCard
        title="Загальна кількість"
        value={totalValue}
        bgcolor="linear-gradient(135deg, #08273b , #365468 )"
        valueFontSize="1.5rem"
      />
      <StatCard
        title="Зламані"
        value={burntValue}
        bgcolor={burntBg}
        valueFontSize="1.5rem"
      />
    </Box>

    <Item sx={{
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <LinksBlock
        component={component}
        onUpdateLinks={onUpdateLinks}
      />
    </Item>
  </Box>
</Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <Item>
          <SectionTitle>Схеми</SectionTitle>
          <SchematicsBlock />
        </Item>
        <Item>
          <SectionTitle>Коментарі</SectionTitle>
          <CommentsBlock />
        </Item>
      </Box>
    </Box>
  );
};

export default ComponentLayout;
