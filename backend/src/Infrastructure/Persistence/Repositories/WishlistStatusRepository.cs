using Application.Common.Interfaces.Repositories;
using Domain.Wishlists.Status;
using LanguageExt;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure.Persistence.Repositories
{
    public class WishlistStatusRepository(ApplicationDbContext context)
        : IWishlistStatusRepository
    {
        public async Task<WishlistStatus> AddAsync(WishlistStatus status, CancellationToken cancellationToken)
        {
            await context.WishlistStatuses.AddAsync(status, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return status;
        }

        public async Task<WishlistStatus> UpdateAsync(WishlistStatus status, CancellationToken cancellationToken)
        {
            context.WishlistStatuses.Update(status);
            await context.SaveChangesAsync(cancellationToken);
            return status;
        }

        public async Task<Option<WishlistStatus>> GetByIdAsync(WishlistStatusId id, CancellationToken cancellationToken)
        {
            var entity = await context.WishlistStatuses
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

            return entity ?? Option<WishlistStatus>.None;
        }
        public async Task<IReadOnlyList<WishlistStatus>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await context.WishlistStatuses
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }
        public async Task<WishlistStatus> DeleteAsync(WishlistStatus status, CancellationToken cancellationToken)
        {
            context.WishlistStatuses.Remove(status);
            await context.SaveChangesAsync(cancellationToken);
            return status;
        }
    }
}