import React from 'react';
import historyStore from './historyStore.js';
import { eventBus } from '../utils/eventBus.js';

const HistoryProvider = ({ children }) => {
  React.useEffect(() => {
    const handler = (data) => {
      const record = {
        id: Date.now() + Math.random(),
        userId: data.userId || 'currentUser',
        userName: data.userName || 'Поточний користувач',
        actionId: data.actionId || 1,
        actionName: data.actionName || 'Оновлено',
        entityId: data.entityId,
        entityTypeId: data.entityTypeId,
        entityTypeName: data.entityTypeName,
        entityName: data.entityName,
        fieldName: data.fieldName,
        oldValue: data.oldValue,
        newValue: data.newValue,
        time: new Date().toISOString()
      };
      historyStore.getState().addHistoryRecord(record);
    };

    eventBus.on('entity:updated', handler);
    eventBus.on('entity:created', handler);
    eventBus.on('entity:deleted', handler);

    return () => {
      eventBus.off('entity:updated', handler);
      eventBus.off('entity:created', handler);
      eventBus.off('entity:deleted', handler);
    };
  }, []);

  return <>{children}</>;
};

export default HistoryProvider;
