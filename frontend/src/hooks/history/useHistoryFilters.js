import { useEffect } from 'react';
import { useEntityTypesStore } from '@store/useEntityTypesStore';
import { useHistoryStore } from '@store/useHistoryStore';
import { useCategoriesStore } from '@store/useCategoriesStore';
import { useComponentsStore } from '@store/useComponentsStore';
import { useWishlistStore } from '@store/useWishlistStore';
import { useUsefulLinksStore } from '@store/useUsefulLinksStore';
import { useSchematicsStore } from '@store/useSchematicsStore';
import { useSchematicLinksStore } from '@store/useSchematicLinksStore';
import { useNeedStatusesStore } from '@store/useNeedStatusesStore';
import { useNeedImportancesStore } from '@store/useNeedImportancesStore';
import { useDamagedComponentReasonsStore } from '@store/useDamagedComponentReasonsStore';


export const useHistoryFilters = ({
  isLab,
  currentTab,
  entityTypes,
  availableEntities,
  selectedEntityTypeId,
  selectedEntityId,
  onEntityTypeSelect,
  onEntitySelect,
}) => {
  const { fetchHistoryByEntity, fetchHistoryByEntityId } = useHistoryStore();

  const fetchEntityTypes = useEntityTypesStore(state => state.fetchEntityTypes);
  const entityTypesFromStore = useEntityTypesStore(state => state.entityTypes || []);

  const { categories, fetchCategories } = useCategoriesStore();
  const { components, fetchComponents } = useComponentsStore();
  const { wishlists, fetchWishlists } = useWishlistStore();
  const { usefulLinks, fetchUsefulLinks } = useUsefulLinksStore();
  const { schematics, fetchAllSchematicsForSearch } = useSchematicsStore();
  const { linksBySchematic } = useSchematicLinksStore();
  const { statuses, fetchStatuses } = useNeedStatusesStore();
  const { needImportances, fetchImportances } = useNeedImportancesStore();
  const { damagedComponentReasons, fetchReasons } = useDamagedComponentReasonsStore();

  useEffect(() => {
    if (currentTab === 'single-entity') {
      console.log('%c[HistoryFilters] Available Entities received:', 'color: #2196f3', availableEntities);
    }
  }, [availableEntities, currentTab]);

  useEffect(() => {
    if (!isLab && entityTypes?.length === 0) {
      fetchEntityTypes();
    }
  }, [entityTypes, fetchEntityTypes, isLab]);

  useEffect(() => {
    if (!isLab && (!categories || categories.length === 0)) {
      fetchCategories();
    }
  }, [categories, fetchCategories, isLab]);

  useEffect(() => {
    if (!isLab && (!components || components.length === 0)) {
      fetchComponents();
    }
  }, [components, fetchComponents, isLab]);

  useEffect(() => {
    if (!isLab && (!wishlists || wishlists.length === 0)) {
      fetchWishlists();
    }
  }, [wishlists, fetchWishlists, isLab]);

  useEffect(() => {
    if (!isLab && currentTab === 'single-entity' && selectedEntityId) {
      fetchUsefulLinks(selectedEntityId);
    }
  }, [selectedEntityId, currentTab, isLab, fetchUsefulLinks]);

  useEffect(() => {
    if (!isLab && currentTab === 'single-entity') {
      fetchAllSchematicsForSearch();
    }
  }, [currentTab, isLab, fetchAllSchematicsForSearch]);

  useEffect(() => {
    if (!isLab && currentTab === 'single-entity') {
        fetchStatuses();
    }
  }, [currentTab, isLab, fetchStatuses]);

  useEffect(() => {
    if (!isLab && currentTab === 'single-entity') {
      fetchImportances();
    }
  }, [currentTab, isLab, fetchImportances]);

  useEffect(() => {
    if (!isLab && currentTab === 'single-entity') {
      fetchReasons();
    }
  }, [currentTab, isLab, fetchReasons]);

  const handleTypeChange = async (event, value) => {
    const typeId = value?.id || null;
    onEntityTypeSelect(typeId);
    if (typeId) await fetchHistoryByEntity(typeId, true, 1);
  };

  const handleEntityChange = async (event, value) => {
    const entityId = value?.id || null;
    onEntitySelect(entityId);
    if (entityId) {
      await fetchHistoryByEntity(entityId, true, 1);
    } else if (selectedEntityTypeId) {
      await fetchHistoryByEntity(selectedEntityTypeId, true, 1);
    }
  };

  const handleSingleEntityChange = async (event, value) => {
    const entityId = value?.id || null;
    onEntitySelect(entityId);
    if (entityId) {
      await fetchHistoryByEntityId(entityId, true, 1);
    }
  };

  const allSchematicLinks = Object.values(linksBySchematic || {}).flat();

  const singleEntityOptions = availableEntities && availableEntities.length > 0
    ? availableEntities
    : [
        ...(categories || []),
        ...(components || []),
        ...(wishlists || []),
        ...(usefulLinks || []),
        ...(schematics || []),
        ...allSchematicLinks,
        ...(statuses || []),
        ...(needImportances || []),
        ...(damagedComponentReasons || [])
      ];

  return {
    entityTypesFromStore,
    singleEntityOptions,
    handleTypeChange,
    handleEntityChange,
    handleSingleEntityChange,
  };
};