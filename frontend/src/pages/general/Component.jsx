import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ComponentLayout from './../../components/component/ComponentLayout';
import { useComponentsStore } from '../../store/useComponentsStore';
import { useSchematicsStore } from '../../store/useSchematicStore';
import { useNeedsStore } from '../../store/useNeedsStore';
import PageWrapper from '../../components/layout/PaperWrapper';
import ComponentModal from '../../components/component/componentBlock/ComponentModal';
import SchematicModal from '../../components/component/schematicsBlock/SchematicModal';
import AddNeedModal from '../../components/brokenComponents/AddNeedModal';
import { eventBus } from '../../utils/eventBus';

const ComponentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    components,
    openEditModal,
    editModal,
    closeEditModal,
    updateComponent,
    deleteComponent,
  } = useComponentsStore();

  const {
    openEditModal: openSchematicEditModal,
   } = useSchematicsStore();

  const addNeed = useNeedsStore(state => state.addNeed);
  const [needModalOpen, setNeedModalOpen] = useState(false);

  const component = components.find(c => c.id === id);

  if (!component) {
    return <div>Компонент не знайдено</div>;
  }

  const handleEditComponent = () => openEditModal(component);

  const handleDeleteComponent = () => {
  eventBus.emit('entity:deleted', {
    userId: 'currentUser',
    userName: 'Дарина',
    actionName: 'Видалено',
    entityTypeId: 4,
    entityTypeName: 'Компонент',
    entityId: component.id,
    entityName: component.name
  });

  deleteComponent(component.id);
  navigate('/components');
};

  const handleUpdateLinks = (updatedLinks) => {
    updateComponent({
      ...component,
      docLink: updatedLinks.docLink,
      buyLink: updatedLinks.buyLink,
      otherLinks: updatedLinks.otherLinks,
    });
  };

  const handleOpenNeedModal = () => setNeedModalOpen(true);

  const handleCloseNeedModal = () => setNeedModalOpen(false);

  const handleAddNeedSubmit = (formData) => {
    const mappedNeed = {
      id: crypto.randomUUID(),
      componentId: component.id,
      componentName: component.name,
      componentImage: component.image,
      categoryId: component.categoryId,
      category: component.category,
      quantity: formData.quantity,
      price: formData.price,
      description: formData.description || component.description,
      reason: formData.reason,
      priority: formData.priority,
      status: 'В очікуванні',
      approvedAt: '',
    };

    addNeed(mappedNeed);
    handleCloseNeedModal();
  };

  const handleOpenAddSchematicModal = () => {
    openSchematicEditModal(null);
  };

  return (
    <PageWrapper>
      <ComponentLayout
        component={component}
        onEdit={handleEditComponent}
        onDelete={handleDeleteComponent}
        onUpdateLinks={handleUpdateLinks}
        onAddNeed={handleOpenNeedModal}
        onAddSchematic={handleOpenAddSchematicModal}
      />

      {editModal.open && (
        <ComponentModal
          key={editModal.component?.id || 'add-new'}
          open={editModal.open}
          component={editModal.component}
          isEditing={!!editModal.component}
          onClose={closeEditModal}
          onSubmit={updateComponent}
        />
      )}


      <AddNeedModal
        open={needModalOpen}
        onClose={handleCloseNeedModal}
        row={component}
        onAdd={handleAddNeedSubmit}
      />
    </PageWrapper>
  );
};

export default ComponentPage;
