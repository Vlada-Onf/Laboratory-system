using Application.Common.Interfaces.Repositories;
using Domain.Wishlists.Importance;
using LanguageExt;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class WishlistImportanceRepository(ApplicationDbContext context)
        : IWishlistImportanceRepository
    {
        public async Task<WishlistImportance> AddAsync(WishlistImportance importance, CancellationToken cancellationToken)
        {
            await context.WishlistImportances.AddAsync(importance, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return importance;
        }

        public async Task<WishlistImportance> UpdateAsync(WishlistImportance importance, CancellationToken cancellationToken)
        {
            context.WishlistImportances.Update(importance);
            await context.SaveChangesAsync(cancellationToken);
            return importance;
        }

        public async Task<Option<WishlistImportance>> GetByIdAsync(WishlistImportanceId id, CancellationToken cancellationToken)
        {
            var entity = await context.WishlistImportances
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);

            return entity ?? Option<WishlistImportance>.None;
        }
        public async Task<IReadOnlyList<WishlistImportance>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await context.WishlistImportances
                .AsNoTracking() 
                .ToListAsync(cancellationToken);
        }
        public async Task<WishlistImportance> DeleteAsync(WishlistImportance importance, CancellationToken cancellationToken)
        {
            context.WishlistImportances.Remove(importance);
            await context.SaveChangesAsync(cancellationToken);
            return importance;
        }
    }
}
