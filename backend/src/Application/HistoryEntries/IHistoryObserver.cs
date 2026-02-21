namespace Application.HistoryEntries
{
    public interface IHistoryObserver
    {
        Task EntityCreatedAsync(
            Guid userId,
            string entityTypeName,
            string entityId,
            string? newValues,
            CancellationToken cancellationToken);

        Task EntityUpdatedAsync(
            Guid userId,
            string entityTypeName,
            string entityId,
            string? oldValues,
            string? newValues,
            CancellationToken cancellationToken);

        Task EntityDeletedAsync(
            Guid userId,
            string entityTypeName,
            string entityId,
            string? oldValues,
            CancellationToken cancellationToken);
    }
}
