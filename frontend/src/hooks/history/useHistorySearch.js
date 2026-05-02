import { useMemo } from 'react';
import { useHistoryStore } from '@store/useHistoryStore';

export const useHistorySearch = (searchText) => {
  const searchOptions = useHistoryStore(s => s.getSearchOptions());

  return useMemo(() => {
    if (!searchText) return searchOptions;

    const q = searchText.toLowerCase();

    return searchOptions.filter(item => {
      const label = (item.label || '').toLowerCase();
      const name = (item.name || '').toLowerCase();
      const title = (item.title || '').toLowerCase();

      return (
        label.includes(q) ||
        name.includes(q) ||
        title.includes(q)
      );
    });
  }, [searchText, searchOptions]);
};