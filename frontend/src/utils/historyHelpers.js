export const NAME_FIELDS = ['name', 'title', 'Name', 'Title', 'text', 'content', 'message', 'body'];

export const dateFormatter = new Intl.DateTimeFormat('uk-UA', {
  day: '2-digit', month: '2-digit', year: 'numeric',
  hour: '2-digit', minute: '2-digit'
});

export const isDateField = (value) => {
  if (!value || typeof value !== 'string') return false;
  return value.match(/^\d{4}-\d{2}-\d{2}/) || value.includes('T') || value.includes('Z');
};

export const safeParse = (data) => {
  if (!data || typeof data !== 'string') return {};
  try { return JSON.parse(data); } catch { return {}; }
};

export const formatChanges = (oldStr, newStr) => {
  const oldVal = safeParse(oldStr);
  const newVal = safeParse(newStr);
  const keys = new Set([...Object.keys(oldVal), ...Object.keys(newVal)]);

  const changes = Array.from(keys)
    .filter(key => oldVal[key] !== newVal[key])
    .map(key => `${key}: "${oldVal[key] || ''}" → "${newVal[key] || ''}"`);

  return changes.length > 0 ? changes.join(', ') : 'Створено';
};