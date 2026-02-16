using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Components;
using Domain.Users;
using Domain.Wishlists;
using LanguageExt;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class WishlistRepository(ApplicationDbContext context)
        : IWishlistRepository, IWishlistQueries
    {
        public async Task<Wishlist> AddAsync(Wishlist wishlist, CancellationToken cancellationToken)
        {
            await context.Wishlists.AddAsync(wishlist, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return wishlist;
        }

        public async Task<Wishlist> UpdateAsync(Wishlist wishlist, CancellationToken cancellationToken)
        {
            context.Wishlists.Update(wishlist);
            await context.SaveChangesAsync(cancellationToken);
            return wishlist;
        }

        public async Task<Wishlist> DeleteAsync(Wishlist wishlist, CancellationToken cancellationToken)
        {
            context.Wishlists.Remove(wishlist);
            await context.SaveChangesAsync(cancellationToken);
            return wishlist;
        }

        public async Task<Option<Wishlist>> GetByIdAsync(WishlistId id, CancellationToken cancellationToken)
        {
            var entity = await context.Wishlists
                .AsNoTracking()
                .FirstOrDefaultAsync(w => w.Id == id, cancellationToken);

            return entity ?? Option<Wishlist>.None;
        }

        public async Task<IReadOnlyList<Wishlist>> GetByComponentIdAsync(ComponentId componentId, CancellationToken cancellationToken)
        {
            return await context.Wishlists
                .AsNoTracking()
                .Where(w => w.ComponentId == componentId)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<Wishlist>> GetByUserAsync(UserId userId, CancellationToken cancellationToken)
        {
            return await context.Wishlists
                .AsNoTracking()
                .Where(w => w.RequestedBy == userId)
                .OrderByDescending(w => w.RequestedAt)
                .ToListAsync(cancellationToken);
        }
        public async Task<IReadOnlyList<Wishlist>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await context.Wishlists
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }
    }
}
