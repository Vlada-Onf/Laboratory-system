import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSearchStore = create(
  persist(
    (set, get) => ({
      searchQuery: '',
      searchResults: [],
      isSearching: false,
      components: [],
      isDataReady: false,

      setSearchData: ({ components = [] }) => {
        set({
          components,
          isDataReady: true
        });
      },

      setSearchQuery: (query) => {
        if (window.searchTimeout) {
          clearTimeout(window.searchTimeout);
          window.searchTimeout = null;
        }
        set({
          searchQuery: query || '',
          isSearching: query?.trim() ? true : false
        });

        if (!query?.trim()) {
          set({ searchResults: [], isSearching: false });
          return;
        }

        window.searchTimeout = setTimeout(() => {
          performSearch(query, get, set);
        }, 300);
      },

      clearSearch: () => {
        if (window.searchTimeout) {
          clearTimeout(window.searchTimeout);
          window.searchTimeout = null;
        }
        set({
          searchQuery: '',
          searchResults: [],
          isSearching: false
        });
      }
    }),
    {
      name: 'search-storage',
      partialize: (state) => ({
        components: state.components,
        isDataReady: state.isDataReady
      }),
    }
  )
);

const performSearch = (query, get, set) => {
  const state = get();

  const lowerQuery = query.toLowerCase();
  const components = state.components || [];

  const foundComponents = components.filter(comp =>
    (comp?.name || '').toLowerCase().includes(lowerQuery) ||
    (comp?.title || '').toLowerCase().includes(lowerQuery) ||
    (comp?.description || '').toLowerCase().includes(lowerQuery)
  );

  const results = foundComponents.map(comp => ({
    ...comp,
    type: 'component'
  }));

  set({ searchResults: results, isSearching: false });
};
