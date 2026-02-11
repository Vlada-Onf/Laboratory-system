using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Components;
using Domain.Needs;
using Domain.Needs.Importance;
using Domain.Needs.Status;
using Domain.Users;
using LanguageExt;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class NeedRepository(ApplicationDbContext context)
        : INeedRepository, INeedQueries
    {
        public async Task<Need> AddAsync(Need need, CancellationToken cancellationToken)
        {
            await context.Needs.AddAsync(need, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return need;
        }

        public async Task<Need> UpdateAsync(Need need, CancellationToken cancellationToken)
        {
            context.Needs.Update(need);
            await context.SaveChangesAsync(cancellationToken);
            return need;
        }

        public async Task<Need> DeleteAsync(Need need, CancellationToken cancellationToken)
        {
            context.Needs.Remove(need);
            await context.SaveChangesAsync(cancellationToken);
            return need;
        }

        public async Task<Option<Need>> GetByIdAsync(NeedId id, CancellationToken cancellationToken)
        {
            var entity = await context.Needs
                .AsNoTracking()
                .FirstOrDefaultAsync(n => n.Id == id, cancellationToken);

            return entity ?? Option<Need>.None;
        }

        public async Task<IReadOnlyList<Need>> GetByComponentIdAsync(ComponentId componentId, CancellationToken cancellationToken)
        {
            return await context.Needs
                .AsNoTracking()
                .Where(n => n.ComponentId == componentId)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<Need>> GetByUserAsync(UserId userId, CancellationToken cancellationToken)
        {
            return await context.Needs
                .AsNoTracking()
                .Where(n => n.RequestedBy == userId)
                .OrderByDescending(n => n.RequestedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<Need>> GetByImportanceAsync(NeedImportanceId importanceId, CancellationToken cancellationToken)
        {
            return await context.Needs
                .AsNoTracking()
                .Where(n => n.ImportanceId == importanceId)
                .ToListAsync(cancellationToken);
        }
        public async Task<IReadOnlyList<Need>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await context.Needs
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }
        public async Task<IReadOnlyList<Need>> GetByStatusAsync(NeedStatusId statusId, CancellationToken cancellationToken)
        {
            return await context.Needs
                .AsNoTracking()
                .Where(n => n.StatusId == statusId)
                .ToListAsync(cancellationToken);
        }
    }
}
