import { useProfileStore } from '@store/useProfileStore';
import { useActionsStore } from '@store/useActionsStore';
import { useEntityTypesStore } from '@store/useEntityTypesStore';
import { safeParse, formatChanges, isDateField, dateFormatter, NAME_FIELDS } from './historyHelpers';
import { useComponentsStore } from '@store/useComponentsStore';
import { useDamagedComponentsStore } from '@store/useDamagedComponentsStore';
import { useNeedsStore } from '@store/useNeedsStore';
import { useWishlistStatusesStore } from '@store/useWishlistStatusesStore';

export const enrichHistory = (rawHistory) => {
  if (!rawHistory?.length) return [];

  const profileStore = useProfileStore.getState();

  const actionsMap = new Map(
    useActionsStore.getState().actions.map(a => [a.id, a])
  );

  const entityTypes = useEntityTypesStore.getState().entityTypes;
  const entityTypesMap = new Map(entityTypes.map(t => [t.id, t]));

  const normalizeId = (id) => id?.toString().toLowerCase();

  const damagedComponents =
    useDamagedComponentsStore?.getState?.().damagedComponents || [];

  const damagedMap = new Map();
  damagedComponents.forEach(d => {
    damagedMap.set(normalizeId(d.id), d.componentId);
  });

  const needs = useNeedsStore?.getState?.().needs || [];
  const needsMap = new Map();
  needs.forEach(n => {
    needsMap.set(normalizeId(n.id), n.componentId || n.component?.id);
  });
  const extractId = (val) => {
    if (!val) return undefined;

    if (typeof val === 'string' || typeof val === 'number') {
      return val.toString();
    }

    if (typeof val === 'object') {
      return (
        val.newValue ||
        val.oldValue ||
        val.value ||
        val.id
      )?.toString();
    }

    return undefined;
  };

  const normalizeKeys = (obj) => {
    if (!obj) return {};
    const res = {};
    Object.keys(obj).forEach(k => {
      res[k.toLowerCase()] = obj[k];
    });
    return res;
  };

  const resolveComponentId = (newValues, oldValues, record) =>
    normalizeId(
      extractId(
        newValues.componentid ||
        newValues.componentId ||
        oldValues.componentid ||
        oldValues.componentId ||
        record.componentId ||
        record.component?.id
      )
    );

  const allEntitiesMap = new Map();

  entityTypes.forEach(type => {
    type.entities?.forEach(e => {
      allEntitiesMap.set(normalizeId(e.id), e.name || e.title);
    });
  });

  const components = useComponentsStore.getState().components;

  if (components?.length) {
    components.forEach(c => {
      allEntitiesMap.set(normalizeId(c.id), c.name || c.title);
    });
  }

  const wishlistStatuses =
  useWishlistStatusesStore.getState().statuses || [];

wishlistStatuses.forEach(s => {
  allEntitiesMap.set(
    normalizeId(s.id),
    s.name || s.title
  );
});


  return rawHistory.map((record) => {
    const action = actionsMap.get(record.actionId);
    const entityType = entityTypesMap.get(record.entityTypeId);

    const oldValues = normalizeKeys(safeParse(record.oldValues));
    const newValues = normalizeKeys(safeParse(record.newValues));

    const typeNameRaw =
      entityType?.name || record.entityTypeName || 'Сутність';

    const typeNameLow = typeNameRaw.toLowerCase();

    let specificEntityName = typeNameRaw;

    const typeHandlers = {
      comment: typeNameLow.includes('comment') || typeNameLow.includes('комент'),
      damaged: typeNameLow.includes('damaged') && !typeNameLow.includes('reason'),
      need: (typeNameLow.includes('need') || typeNameLow.includes('потреба')) &&
            !typeNameLow.includes('importance') &&
            !typeNameLow.includes('status'),
    };

    const isStatus = typeNameLow.includes('status') || typeNameLow.includes('статус');

    const getComponentName = (componentId) =>
      allEntitiesMap.get(normalizeId(componentId));

    const componentId = resolveComponentId(newValues, oldValues, record);

    const fallbackComponentId =
      damagedMap.get(normalizeId(record.entityId)) ||
      needsMap.get(normalizeId(record.entityId)) ||
      componentId;

    const finalComponentId = fallbackComponentId;
    const componentName = getComponentName(finalComponentId);

    if (typeHandlers.comment || typeHandlers.damaged || typeHandlers.need || isStatus) {
      let prefix = 'Сутність';
      if (typeHandlers.comment) prefix = 'Коментар до';
      else if (typeHandlers.damaged) prefix = 'Пошкодження';
      else if (typeHandlers.need) prefix = 'Потреба';
      else if (isStatus) prefix = 'Статус';

      if (componentName) {
        specificEntityName = `${prefix}: ${componentName}`;
      } else {
        const resolvedStatusId =
  record.entityId ||
  newValues.statusId ||
  newValues.wishlistStatusId ||
  newValues.status?.id ||
  oldValues.status?.id ||
  oldValues.statusId;

const nameFromMap =
  allEntitiesMap.get(normalizeId(resolvedStatusId));
        if (nameFromMap) {
          specificEntityName = `${prefix}: ${nameFromMap}`;
        } else {
          const text =
            newValues.name ||
            oldValues.name ||
            newValues.title ||
            oldValues.title ||
            newValues.content ||
            oldValues.content ||
            newValues.text ||
            oldValues.text ||
            record.content;

          specificEntityName = text
            ? (text.length > 50 ? text.substring(0, 50) + '...' : text)
            : `${prefix} #${record.entityId?.slice(-8)}`;
        }
      }
    } else {
      for (const field of NAME_FIELDS) {
        let val =
          oldValues[field.toLowerCase()] ||
          newValues[field.toLowerCase()];

        if (val === undefined || val === null) {
          const parsedOld = safeParse(record.oldValues);
          const parsedNew = safeParse(record.newValues);

          const extractField = (data) => {
            if (!data) return undefined;
            if (Array.isArray(data)) {
              for (const item of data) {
                if (item && typeof item === 'object') {
                  const match = item[field.toLowerCase()] || item[field];
                  if (match) return match;
                }
              }
            } else if (typeof data === 'object') {
              return data[field.toLowerCase()] || data[field];
            }
            return undefined;
          };

          val = extractField(parsedOld) || extractField(parsedNew);
        }

        if (val !== undefined && val !== null) {
          if (Array.isArray(val)) {
            val = val.map(item => {
              if (typeof item === 'object') {
                return item.name || item.title || JSON.stringify(item);
              }
              return String(item);
            }).join(', ');
          } else if (typeof val === 'object') {
            val = val.name || val.title || JSON.stringify(val);
          } else {
            val = String(val);
          }

          if (val.trim() && !isDateField(val)) {
            specificEntityName = val;
            break;
          }
        }
      }
    }

    if (specificEntityName === typeNameRaw && record.entityId) {
      const nameFromMap =
        allEntitiesMap.get(normalizeId(record.entityId));

      if (nameFromMap) {
        specificEntityName = nameFromMap;
      }
    }

    if (specificEntityName === typeNameRaw) {
      specificEntityName = `${typeNameRaw} #${record.entityId?.slice(-8)}`;
    }

    const isMe = profileStore.profile?.id === record.userId;

    let userName, userAvatar;

    if (record.authorFirstName) {
      userName = `${record.authorFirstName}${
        record.authorLastName ? ` ${record.authorLastName}` : ''
      }`;
      userAvatar = record.authorPhotoUrl || null;
    } else if (isMe) {
      const p = profileStore.profile;
      userName = `${p.firstName || p.name || 'Я'}${
        p.lastName ? ` ${p.lastName}` : ''
      }`;
      userAvatar = p.photoUrl || p.avatar || null;
    } else {
      userName = `Користувач ${record.userId?.slice(-6)}`;
      userAvatar = null;
    }

    const searchLabel =
  newValues.name ||
  oldValues.name ||
  newValues.title ||
  oldValues.title ||
  record.content ||
  specificEntityName;

    return {
      ...record,
      actionName: action?.name || 'Дія',
      entityName: specificEntityName,
      searchLabel,
      userName,
      userAvatar,
      changesText: formatChanges(record.oldValues, record.newValues),
      timeFormatted: dateFormatter.format(new Date(record.time))
    };
  });
};