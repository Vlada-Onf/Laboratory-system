using Domain.Users;
using Domain.Wishlists;
using LanguageExt;

namespace Application.Common.Interfaces.Queries
{
    public interface IWishlistQueries
    {
        Task<Option<Wishlist>> GetByIdAsync(WishlistId id, CancellationToken cancellationToken);
        Task<IReadOnlyList<Wishlist>> GetByUserAsync(UserId userId, CancellationToken cancellationToken);
        Task<IReadOnlyList<Wishlist>> GetAllAsync(CancellationToken cancellationToken);
    }
}
