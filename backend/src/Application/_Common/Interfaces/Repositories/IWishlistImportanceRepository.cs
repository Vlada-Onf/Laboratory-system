using Domain.Wishlists.Importance;
using LanguageExt;

namespace Application.Common.Interfaces.Repositories
{
    public interface IWishlistImportanceRepository
    {
        Task<WishlistImportance> AddAsync(WishlistImportance importance, CancellationToken cancellationToken);
        Task<WishlistImportance> UpdateAsync(WishlistImportance importance, CancellationToken cancellationToken);
        Task<WishlistImportance> DeleteAsync(WishlistImportance importance, CancellationToken cancellationToken);

        Task<Option<WishlistImportance>> GetByIdAsync(WishlistImportanceId id, CancellationToken cancellationToken);
        Task<IReadOnlyList<WishlistImportance>> GetAllAsync(CancellationToken cancellationToken);
    }
}
