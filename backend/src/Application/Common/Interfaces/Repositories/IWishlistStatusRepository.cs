using Domain.Wishlists.Status;
using LanguageExt;

namespace Application.Common.Interfaces.Repositories
{
    public interface IWishlistStatusRepository
    {
        Task<WishlistStatus> AddAsync(WishlistStatus status, CancellationToken cancellationToken);
        Task<WishlistStatus> UpdateAsync(WishlistStatus status, CancellationToken cancellationToken);
        Task<WishlistStatus> DeleteAsync(WishlistStatus status, CancellationToken cancellationToken);

        Task<Option<WishlistStatus>> GetByIdAsync(WishlistStatusId id, CancellationToken cancellationToken);
        Task<IReadOnlyList<WishlistStatus>> GetAllAsync(CancellationToken cancellationToken);
    }
}
