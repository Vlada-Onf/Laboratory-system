using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.History;
using Domain.History.EntityTypes;
using Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class HistoryRepository(ApplicationDbContext context)
        : IHistoryRepository, IHistoryQueries
    {
        public async Task<History> AddAsync(History entry, CancellationToken cancellationToken)
        {
            await context.History.AddAsync(entry, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return entry;
        }

        public async Task<IReadOnlyList<History>> GetByUserAsync(UserId userId, CancellationToken cancellationToken)
        {
            return await context.History
                .AsNoTracking()
                .Where(h => h.UserId == userId)
                .OrderByDescending(h => h.Time)
                .ToListAsync(cancellationToken);
        }
        public async Task<History> DeleteAsync(History entry, CancellationToken cancellationToken)
        {
            context.History.Remove(entry);
            await context.SaveChangesAsync(cancellationToken);
            return entry;
        }

        public async Task<IReadOnlyList<History>> GetByEntityAsync(string entityId, CancellationToken cancellationToken)
        {
            return await context.History
                .AsNoTracking()
                .Where(h => h.EntityId == entityId)
                .OrderByDescending(h => h.Time)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<History>> GetByEntityAndTypeAsync(EntityTypeId entityTypeId, string entityId, CancellationToken cancellationToken)
        {
            return await context.History
                .AsNoTracking()
                .Where(h => h.EntityTypeId == entityTypeId && h.EntityId == entityId)
                .OrderByDescending(h => h.Time)
                .ToListAsync(cancellationToken);
        }
        public async Task<IReadOnlyList<History>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await context.History
                .AsNoTracking()
                .OrderByDescending(h => h.Time)
                .ToListAsync(cancellationToken);
        }
    }
}
