using Application.Common.Interfaces.Repositories;
using Domain.Needs.Importance;
using LanguageExt;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class NeedImportanceRepository(ApplicationDbContext context) : INeedImportanceRepository
    {
        public async Task<NeedImportance> AddAsync(NeedImportance importance, CancellationToken cancellationToken)
        {
            await context.NeedImportances.AddAsync(importance, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return importance;
        }

        public async Task<NeedImportance> UpdateAsync(NeedImportance importance, CancellationToken cancellationToken)
        {
            context.NeedImportances.Update(importance);
            await context.SaveChangesAsync(cancellationToken);
            return importance;
        }

        public async Task<Option<NeedImportance>> GetByIdAsync(NeedImportanceId id, CancellationToken cancellationToken)
        {
            var entity = await context.NeedImportances
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);

            return entity ?? Option<NeedImportance>.None;
        }
        public async Task<IReadOnlyList<NeedImportance>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await context.NeedImportances
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }
        public async Task<NeedImportance> DeleteAsync(NeedImportance importance, CancellationToken cancellationToken)
        {
            context.NeedImportances.Remove(importance);
            await context.SaveChangesAsync(cancellationToken);
            return importance;
        }

        public async Task<Option<NeedImportance>> GetByLevelAsync(int level, CancellationToken cancellationToken)
        {
            var entity = await context.NeedImportances
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.Level == level, cancellationToken);

            return entity ?? Option<NeedImportance>.None;
        }
    }
}
