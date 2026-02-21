using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Domain.History.EntityTypes;
using Domain.Users;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.HistoryOfAction
{
    public class HistoryObserver : IHistoryObserver
    {
        private readonly ApplicationDbContext _context;
        private readonly IHistoryRepository _historyRepository;

        public HistoryObserver(
            ApplicationDbContext context,
            IHistoryRepository historyRepository)
        {
            _context = context;
            _historyRepository = historyRepository;
        }

        public async Task EntityCreatedAsync(
            Guid userId,
            string entityTypeName,
            string entityId,
            string? newValues,
            CancellationToken cancellationToken)
        {
            await AddInternalAsync(
                userId,
                "Created",
                entityTypeName,
                entityId,
                oldValues: null,
                newValues: newValues,
                cancellationToken);
        }

        public async Task EntityUpdatedAsync(
            Guid userId,
            string entityTypeName,
            string entityId,
            string? oldValues,
            string? newValues,
            CancellationToken cancellationToken)
        {
            await AddInternalAsync(
                userId,
                "Updated",
                entityTypeName,
                entityId,
                oldValues,
                newValues,
                cancellationToken);
        }

        public async Task EntityDeletedAsync(
            Guid userId,
            string entityTypeName,
            string entityId,
            string? oldValues,
            CancellationToken cancellationToken)
        {
            await AddInternalAsync(
                userId,
                "Deleted",
                entityTypeName,
                entityId,
                oldValues,
                newValues: null,
                cancellationToken);
        }

        private async Task AddInternalAsync(
            Guid userId,
            string actionName,
            string entityTypeName,
            string entityId,
            string? oldValues,
            string? newValues,
            CancellationToken cancellationToken)
        {
            var action = await _context.Set<Action>()
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.Name == actionName, cancellationToken);

            if (action is null)
                throw new InvalidOperationException($"Action with Name='{actionName}' not found.");

            var entityType = await _context.Set<EntityType>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Name == entityTypeName, cancellationToken);

            if (entityType is null)
                throw new InvalidOperationException($"EntityType with Name='{entityTypeName}' not found.");

            var entry = Domain.History.History.Create(
                userId: new UserId(userId),
                actionId: action.Id,
                entityTypeId: entityType.Id,
                entityId: entityId,
                oldValues: oldValues,
                newValues: newValues);

            await _historyRepository.AddAsync(entry, cancellationToken);
        }
    }
}
