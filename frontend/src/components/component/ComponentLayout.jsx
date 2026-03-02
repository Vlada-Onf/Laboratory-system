import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import ComponentCard from './componentBlock/ComponentCard';
import Item from './Item';
import SectionTitle from './SectionTitle';
import StatCard from './countsBlock/StatCard';
import LinksBlock from './linksBlock/LinksBlock';
import SchematicsBlock from './schematicsBlock/SchematicsBlock';
import CommentsBlock from './commentsBlock/CommentsBlock';
import AddDamagedModal from '../brokenComponents/AddDamagedModal';
import { useComponentsStore } from '@store/useComponentsStore';
import { useSchematicsStore } from '@store/useSchematicsStore';
import { useDamagedComponentsStore } from '@store/useDamagedComponentsStore';

const ComponentLayout = ({ component, onEdit, onDelete, onUpdateLinks, onAddNeed }) => {

  const { setCurrentComponent } = useComponentsStore();
  const { openEditModal } = useSchematicsStore();
  const {damagedComponents, fetchDamagedComponents } = useDamagedComponentsStore();

  const [openDamagedModal, setOpenDamagedModal] = useState(false);
  const componentId = component?.id;

  const lastDamagedRecord = useMemo(() => {
    if (!componentId || !Array.isArray(damagedComponents)) {
      return null;
    }

    return damagedComponents
      .filter(item => item?.componentId === componentId)
      .sort((a, b) => {
        const dateA = new Date(b.recordedAt || b.lastUpdatedAt || 0).getTime();
        const dateB = new Date(a.recordedAt || a.lastUpdatedAt || 0).getTime();
        return dateA - dateB;
      })
      .at(0) || null;
  }, [componentId, damagedComponents]);

  const currentDamaged = useMemo(() => ({
    quantity: lastDamagedRecord?.quantity || 0,
    description: lastDamagedRecord?.description || ''
  }), [lastDamagedRecord]);

  const totalValue = useMemo(() =>
    `${component?.quantity || 0} шт`,
    [component?.quantity]
  );

  const burntValue = useMemo(() =>
    `${currentDamaged.quantity} шт`,
    [currentDamaged.quantity]
  );

  const burntBg = useMemo(() => 
    currentDamaged.quantity === 0
      ? 'linear-gradient(135deg, #5bc522, #a8e063)'
      : 'linear-gradient(135deg, #f16731, #f4926c)',
    [currentDamaged.quantity]
  );

  const componentForCard = useMemo(() => {
    const photoUrl = component?.photoUrl ||
                     component?.photo ||
                     component?.imageUrl ||
                     component?.image ||
                     'https://via.placeholder.com/300x300/08273b/ffffff?text=No+Image';

    return {
      ...component,
      image: photoUrl,
      photoUrl: photoUrl,
      tags: Array.isArray(component?.tags) ? component.tags : [],
      categoryId: component?.categoryId
    };
  }, [component]);

  const handleOpenDamagedModal = useCallback(() => {
    setOpenDamagedModal(true);
  }, []);

  const handleCloseDamagedModal = useCallback(() => {
    setOpenDamagedModal(false);
  }, []);

  const handleOpenAddSchematicModal = useCallback(() => {
    openEditModal(null);
  }, [openEditModal]);

  useEffect(() => {
    if (component?.id) {
      setCurrentComponent(component);
      fetchDamagedComponents();
    }
  }, [component?.id, setCurrentComponent, fetchDamagedComponents]);

  if (!component) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
        Завантаження компонента...
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      width: '100%',
      p: { xs: 1.5, sm: 2, md: 3 }
    }}>
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
            {...componentForCard}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddNeed={onAddNeed}
          />
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            <StatCard
              title="Загальна кількість"
              value={totalValue}
              bgcolor="linear-gradient(135deg, #08273b, #365468)"
            />
            <StatCard
              title="Зламані"
              value={burntValue}
              bgcolor={burntBg}
              onEdit={handleOpenDamagedModal}
              showEditButton={true}
            />
          </Box>

          <Item sx={{ flex: 1, display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
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
          <SchematicsBlock
            componentId={component.id}
            onAddSchematic={handleOpenAddSchematicModal}
          />
        </Item>

        <Item>
          <SectionTitle>Коментарі</SectionTitle>
          <CommentsBlock componentId={component.id} />
        </Item>
      </Box>

      <AddDamagedModal
        open={openDamagedModal}
        onClose={handleCloseDamagedModal}
        component={component}
        lastDamagedRecord={lastDamagedRecord}
      />
    </Box>
  );
};

ComponentLayout.displayName = 'ComponentLayout';

export default React.memo(ComponentLayout);
