import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ComponentLayout from './../../components/component/ComponentLayout';
import { useComponentsStore } from '../../store/useComponentsStore';
import { useCategoriesStore } from '../../store/useCategoriesStore';
import { useNeedsStore } from '../../store/useNeedsStore';
import PageWrapper from '../../components/layout/PaperWrapper';
import ComponentModal from '../../components/component/componentBlock/ComponentModal';
import AddNeedModal from '../../components/needsTable/AddNeedModal';

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

  const { fetchCategories, isLoading: categoriesLoading } = useCategoriesStore();
  const addNeed = useNeedsStore(state => state.addNeed);

  const [needModalOpen, setNeedModalOpen] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      fetchCategories(),
      fetchComponents()
    ]).catch(console.error);
  }, [fetchCategories, fetchComponents]);

  const component = useMemo(() =>
    components.find(c => c.id === id),
    [components, id]
  );

  const pageLoading = componentsLoading || categoriesLoading;

  const handleComponentSubmit = useCallback(async (formData, selectedFile) => {
    const componentId = editModal.component?.id || id;
    try {
      await updateComponent(componentId, formData, selectedFile);
      await fetchComponents();
      closeEditModal();
    } catch (error) {
      console.error('Помилка оновлення:', error);
    }
  }, [editModal.component?.id, id, updateComponent, fetchComponents, closeEditModal]);

  const handleEditComponent = useCallback(() => {
    if (component) openEditModal(component);
  }, [component, openEditModal]);

  const handleDeleteComponent = useCallback(() => {
    if (component) {
      deleteComponent(component.id);
      navigate('/front-components');
    }
  }, [component, deleteComponent, navigate]);

  const handleUpdateLinks = useCallback(async (updatedLinks) => {
    if (component) {
      try {
        await updateComponent(component.id, {
          supplierLink: updatedLinks.buyLink || "string",
          documentationLink: updatedLinks.docLink || "string",
        });
        await fetchComponents();
      } catch (error) {
        console.error('Помилка оновлення посилань:', error);
      }
    }
  }, [component, updateComponent, fetchComponents]);

  const handleOpenNeedModal = useCallback(() => {
    setNeedModalOpen(true);
  }, []);

  const handleCloseNeedModal = useCallback(() => {
    setNeedModalOpen(false);
  }, []);

  const handleAddNeedSubmit = useCallback((formData) => {
    if (component) {
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
    }
  }, [component, addNeed, handleCloseNeedModal]);

  const handleOpenAddSchematicModal = useCallback(() => {
  }, []);

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
