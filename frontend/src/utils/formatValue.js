export function formatValue(value, type = 'number') {
  if (value == null) {
    return '-';
  }

  if (type === 'currency') {
    return `${value.toLocaleString('uk-UA')} ₴`;
  }

  return value.toLocaleString();
}
