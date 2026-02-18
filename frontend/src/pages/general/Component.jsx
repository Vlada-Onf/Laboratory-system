import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ComponentLayout from './../../components/component/ComponentLayout';
import { useComponentsStore } from '../../store/useComponentsStore';
import { useCategoriesStore } from '../../store/useCategoriesStore';
import { useSchematicsStore } from '../../store/useSchematicsStore';
import { useNeedsStore } from '../../store/useNeedsStore';
import PageWrapper from '../../components/layout/PaperWrapper';
import ComponentModal from '../../components/component/componentBlock/ComponentModal';
import AddNeedModal from '../../components/brokenComponents/AddNeedModal';
import { eventBus } from '../../utils/eventBus';

const ComponentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    components,
    isLoading: componentsLoading,
    openEditModal,
    editModal,
    closeEditModal,
    updateComponent,
    fetchComponents,
    deleteComponent,
  } = useComponentsStore();

  const { fetchCategories,  isLoading: categoriesLoading } = useCategoriesStore();
  
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  const { openEditModal: openSchematicEditModal } = useSchematicsStore();
  const addNeed = useNeedsStore(state => state.addNeed);
  const [needModalOpen, setNeedModalOpen] = useState(false);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        await fetchCategories();
        setCategoriesLoaded(true);

        await fetchComponents();
      } catch (error) {
        console.error('Помилка ComponentPage:', error);
      }
    };

    loadAllData();
  }, [fetchCategories, fetchComponents]);

  const component = components.find(c => c.id === id);

  const pageLoading = componentsLoading || categoriesLoading || !categoriesLoaded;

  if (pageLoading) {
    return (
      <PageWrapper>
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <div>Завантажуємо компонент...</div>
        </div>
      </PageWrapper>
    );
  }

  if (!component) {
    return (
      <PageWrapper>
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h2>Компонент не знайдено</h2>
          <button onClick={() => navigate('/front-components')}>← Назад</button>
        </div>
      </PageWrapper>
    );
  }

  const handleComponentSubmit = async (formData, selectedFile) => {
  const componentId = editModal.component?.id || id;
  try {
    await updateComponent(componentId, formData, selectedFile);
    await fetchComponents();
    closeEditModal();
  } catch (error) {
    console.error('Помилка оновлення компонента:', error);
  }
};


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
    navigate('/front-components');
  };

  const handleUpdateLinks = async (updatedLinks) => {
    try {
      await updateComponent(component.id, {
        supplierLink: updatedLinks.buyLink || "string",
        documentationLink: updatedLinks.docLink || "string",
      });
      await fetchComponents();
    } catch (error) {
      console.error('Помилка оновлення посилань:', error);
    }
  };

  const handleOpenNeedModal = () => setNeedModalOpen(true);
  const handleCloseNeedModal = () => setNeedModalOpen(false);

  const handleAddNeedSubmit = (formData) => {
    const mappedNeed = {
      id: crypto.randomUUID(),
      componentId: component.id,
      componentName: component.name,
      componentImage: component.photoUrl,
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
          key={editModal.component?.id || 'edit'}
          open={editModal.open}
          component={editModal.component}
          isEditing={!!editModal.component}
          onClose={closeEditModal}
          onSubmit={handleComponentSubmit}
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
