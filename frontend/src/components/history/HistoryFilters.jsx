import { Tabs, Tab, Paper, Autocomplete, TextField, Stack, CircularProgress } from '@mui/material';
import { Person, HistoryEdu, Signpost, Group } from '@mui/icons-material';
import { useHistoryFilters } from '../../hooks/history/useHistoryFilters';

const HistoryFilters = ({
  currentTab,
  onTabChange,
  isLab,
  users,
  onUserSelectUser,
  onSelectUser,
  onUserSelect,
  entityTypes,
  availableEntities,
  selectedEntityTypeId,
  selectedEntityId,
  onEntityTypeSelect,
  onEntitySelect,
  isLoadingEntities
}) => {
  const {
    entityTypesFromStore,
    singleEntityOptions,
    handleTypeChange,
    handleEntityChange,
    handleSingleEntityChange,
  } = useHistoryFilters({
    isLab,
    currentTab,
    entityTypes,
    availableEntities,
    selectedEntityTypeId,
    selectedEntityId,
    isLoadingEntities,
    onEntityTypeSelect,
    onEntitySelect,
  });

  const activeColor = '#5bc522';

  const allTabs = [
    { value: 'all', label: 'Вся історія', icon: <HistoryEdu />, roles: ['admin'] },
    { value: 'my', label: 'Моя історія', icon: <Person />, roles: ['admin', 'lab'] },
    { value: 'user', label: 'За користувачем', icon: <Group />, roles: ['admin'] },
    { value: 'entity', label: 'За сутністю', icon: <Signpost />, roles: ['admin'] },
    { value: 'single-entity', label: 'За елементом', icon: <Signpost />, roles: ['admin'] },
  ];

  const visibleTabs = allTabs.filter(tab =>
    isLab ? tab.roles.includes('lab') : tab.roles.includes('admin')
  );

  return (
    <Paper sx={{ p: 1.2, mb: 1, borderRadius: 4, boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' }}>
      <Stack spacing={2}>
        <Tabs
          value={currentTab}
          onChange={(e, v) => onTabChange(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 40,
            '& .MuiTabs-indicator': { backgroundColor: activeColor, height: 3, borderRadius: '3px 3px 0 0' },
          }}
        >
          {visibleTabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              iconPosition="start"
              label={tab.label}
              disabled={isLab && tab.value !== 'my'}
              sx={{
                minHeight: 40,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'text.secondary',
                '&.Mui-selected': { color: activeColor },
                '& .MuiSvgIcon-root': { fontSize: 20 }
              }}
            />
          ))}
        </Tabs>

        {!isLab && (
          <>
            {currentTab === 'user' && (
              <Autocomplete
                options={users || []}
                getOptionLabel={(o) => `${o.firstName || ''} ${o.lastName || ''} (${o.email})`}
                onChange={(e, v) => {
                  const userId = v?.id || null;

                  if (typeof onUserSelectUser === 'function') {
                    onUserSelectUser(userId);
                  } else if (typeof onSelectUser === 'function') {
                    onSelectUser(userId);
                  } else if (typeof onUserSelect === 'function') {
                    onUserSelect(userId);
                  }
                }}
                renderInput={(p) => <TextField {...p} label="Оберіть користувача" size="small" fullWidth />}
              />
            )}

            {currentTab === 'entity' && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Autocomplete
                  sx={{ flex: 1 }}
                  options={entityTypes && entityTypes.length > 0 ? entityTypes : entityTypesFromStore}
                  getOptionLabel={(o) => o?.name || ''}
                  value={
                    (entityTypes && entityTypes.find(t => t.id === selectedEntityTypeId)) ||
                    entityTypesFromStore.find(t => t.id === selectedEntityTypeId) ||
                    null
                  }
                  onChange={handleTypeChange}
                  renderInput={(p) => <TextField {...p} label="Категорія (Тип сутності)" size="small" />}
                />

                {selectedEntityTypeId && availableEntities?.length > 0 && (
                  <Autocomplete
                    sx={{ flex: 1 }}
                    options={availableEntities}
                    getOptionLabel={(o) => o?.name || o?.title || 'Без назви'}
                    value={availableEntities.find(e => e.id === selectedEntityId) || null}
                    onChange={handleEntityChange}
                    renderInput={(p) => <TextField {...p} label="Конкретний елемент (необов'язково)" size="small" />}
                  />
                )}
              </Stack>
            )}

            {currentTab === 'single-entity' && (
              <Autocomplete
                options={singleEntityOptions}
                getOptionLabel={(o) => o?.name || o?.title || 'Без назви'}
                getOptionKey={(option) => `${option.id}-${option.name || option.title || 'default'}`}
                value={singleEntityOptions.find(e => e.id === selectedEntityId) || null}
                onChange={handleSingleEntityChange}
                noOptionsText={isLoadingEntities ? "Завантаження..." : "Нічого не знайдено"}
                renderInput={(p) => (
                  <TextField
                    {...p}
                    label="Введіть назву елемента для пошуку"
                    size="small"
                    fullWidth
                    error={singleEntityOptions.length === 0 && !isLoadingEntities}
                    helperText={
                      isLoadingEntities
                        ? "Завантаження сутностей..."
                        : (singleEntityOptions.length === 0 ? "Спочатку завантажте дані сутностей" : "")
                    }
                    InputProps={{
                      ...p.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingEntities ? <CircularProgress color="inherit" size={20} /> : null}
                          {p.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default HistoryFilters;