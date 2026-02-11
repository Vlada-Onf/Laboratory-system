using Application.Common.Interfaces.Repositories;
using Domain.Needs.Status;
using LanguageExt;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class NeedStatusRepository(ApplicationDbContext context) : INeedStatusRepository
    {
        public async Task<NeedStatus> AddAsync(NeedStatus status, CancellationToken cancellationToken)
        {
            await context.NeedStatuses.AddAsync(status, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return status;
        }

        public async Task<NeedStatus> UpdateAsync(NeedStatus status, CancellationToken cancellationToken)
        {
            context.NeedStatuses.Update(status);
            await context.SaveChangesAsync(cancellationToken);
            return status;
        }

        public async Task<Option<NeedStatus>> GetByIdAsync(NeedStatusId id, CancellationToken cancellationToken)
        {
            var entity = await context.NeedStatuses
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

            return entity ?? Option<NeedStatus>.None;
        }
        public async Task<IReadOnlyList<NeedStatus>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await context.NeedStatuses
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }
        public async Task<NeedStatus> DeleteAsync(NeedStatus status, CancellationToken cancellationToken)
        {
            context.NeedStatuses.Remove(status);
            await context.SaveChangesAsync(cancellationToken);
            return status;
        }

        public async Task<Option<NeedStatus>> GetByNameAsync(string name, CancellationToken cancellationToken)
        {
            var entity = await context.NeedStatuses
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Name == name, cancellationToken);

            return entity ?? Option<NeedStatus>.None;
        }
    }
}
