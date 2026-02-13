export const formatHistoryForWidget = (historyRecords) => {
  return historyRecords
    .slice(0, 4)
    .map(record => ({
      id: record.id,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(record.userName)}&background=1976d2&color=fff&size=40&bold=true`,
      name: record.userName,
      action: `${record.actionName} "${record.entityName}"`,
      time: formatRelativeTime(record.time)
    }));
};

const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const recordTime = new Date(timestamp);
  const diffMs = now - recordTime;

  if (diffMs < 60 * 1000){
    return 'щойно';
  }

  if (diffMs < 60 * 60 * 1000){
    return `${Math.floor(diffMs / 60000)} хв тому`;
  }
  
  if (diffMs < 24 * 60 * 60 * 1000){
    return `${Math.floor(diffMs / 3600000)} год тому`;
}
  return 'вчора';
};
