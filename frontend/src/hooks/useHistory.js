import historyStore from '../store/historyStore';

export const useHistory = () => {
  const history = historyStore((state) => state.history);
  const isLoading = historyStore((state) => state.isLoading);
  const addHistoryRecord = historyStore((state) => state.addHistoryRecord);
  const fetchHistory = historyStore((state) => state.fetchHistory);

  return {
    history,
    isLoading,
    addHistoryRecord,
    fetchHistory
  };
};
