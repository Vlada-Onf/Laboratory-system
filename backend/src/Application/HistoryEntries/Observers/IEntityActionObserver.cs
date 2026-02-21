namespace Application.HistoryEntries.Observers
{
    public interface IEntityActionObserver
    {
        Task OnEntityCreatedAsync(
            Guid userId,
            Guid entityTypeId,
            string entityId,
            string? newValues,
            CancellationToken cancellationToken);

        Task OnEntityUpdatedAsync(
            Guid userId,
            Guid entityTypeId,
            string entityId,
            string? oldValues,
            string? newValues,
            CancellationToken cancellationToken);

        Task OnEntityDeletedAsync(
            Guid userId,
            Guid entityTypeId,
            string entityId,
            string? oldValues,
            CancellationToken cancellationToken);
    }
}
