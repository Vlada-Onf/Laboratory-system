import { Box, Typography } from '@mui/material';
import ChangeField from './ChangeField';

const ChangeList = ({ record, entityTypes }) => {

  const safeParse = (data) => {
    if (!data || typeof data !== 'string'){
      return {};
    }
    try { return JSON.parse(data); }
    catch { return {}; }
  };

  const isIdField = (fieldName) => {
    const idFields = [
      'id','Id','ID',
      'statusId','StatusId',
      'importanceId','ImportanceId',
      'categoryId','CategoryId',
      'typeId','TypeId',
      'roleId','RoleId',
      'priorityId','PriorityId'
    ];
    return idFields.some(f => fieldName.toLowerCase().includes(f.toLowerCase()));
  };

  const systemFields = [
    'Id','LastUpdatedAt', 'CreatedAt', 'CreatedBy',
    'LastUpdatedBy', 'CompletedAt', 'UpdatedAt',
    'ImportanceId', 'UpdatedBy', 'StatusId',
    'SchematicId', 'ComponentId', 'CategoryId', 'ReasonId',
    'RecordedAt','RecordedBy','RequestedAt','RequestedBy'
  ];

  const getFieldDisplayName = (fieldName, entityTypeId) => {
    const entityType = entityTypes.find(et => et.id === entityTypeId);
    if (!entityType?.fields){
      return fieldName;
    }

    const field = entityType.fields.find(f =>
      f.systemName === fieldName || f.fieldName === fieldName || f.name.toLowerCase().replace(/\s+/g,'') === fieldName
    );
    return field?.displayName || field?.name || fieldName;
  };

  const normalizeValue = (val) => {
    if (val === null || val === undefined || val === ''){
      return 'порожньо';
    }
    if (typeof val === 'number' && val === 0){
      return 'порожньо';
    }
    if (Array.isArray(val) && val.length === 0){
      return 'порожньо';
    }
    if (typeof val === 'boolean'){
      return val ? 'так' : 'ні';}
    return val;
  };

  const oldValuesRaw = safeParse(record.oldValues);
  const newValuesRaw = safeParse(record.newValues);

  const actionName = record.actionName || '';
  if (actionName.includes('Створено') || actionName.includes('Created')) {
    return <Typography variant="body2" fontWeight={500}>Додано елемент</Typography>;
  }
  if (actionName.includes('Видалено') || actionName.includes('Deleted')) {
    return <Typography variant="body2" fontWeight={500}>Видалено елемент</Typography>;
  }

  const changes = Object.keys({ ...oldValuesRaw, ...newValuesRaw })
    .filter(key => {
      if (systemFields.includes(key)) return false;
      const oldNorm = normalizeValue(oldValuesRaw[key]);
      const newNorm = normalizeValue(newValuesRaw[key]);
      return JSON.stringify(oldNorm) !== JSON.stringify(newNorm);
    });

  if (!changes.length){
    return <Typography variant="body2">Внесено зміни</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {changes.map((field, index) => (
        <ChangeField
          key={index}
          field={field}
          oldValue={normalizeValue(oldValuesRaw[field])}
          newValue={normalizeValue(newValuesRaw[field])}
          entityTypeId={record.entityTypeId}
          getFieldDisplayName={getFieldDisplayName}
          isIdField={isIdField}
        />
      ))}
    </Box>
  );
};

export default ChangeList;