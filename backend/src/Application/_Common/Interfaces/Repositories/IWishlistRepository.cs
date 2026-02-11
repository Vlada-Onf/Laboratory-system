using Domain.Wishlists;
using LanguageExt;

namespace Application.Common.Interfaces.Repositories
{
    public interface IWishlistRepository
    {
        Task<Wishlist> AddAsync(Wishlist wishlist, CancellationToken cancellationToken);
        Task<Wishlist> UpdateAsync(Wishlist wishlist, CancellationToken cancellationToken);
        Task<Wishlist> DeleteAsync(Wishlist wishlist, CancellationToken cancellationToken);

        Task<Option<Wishlist>> GetByIdAsync(WishlistId id, CancellationToken cancellationToken);
    }
}
