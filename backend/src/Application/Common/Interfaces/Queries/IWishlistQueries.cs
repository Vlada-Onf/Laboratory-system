using Domain.Components;
using Domain.Users;
using Domain.Wishlists;
using LanguageExt;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Queries
{
    public interface IWishlistQueries
    {
        Task<Option<Wishlist>> GetByIdAsync(WishlistId id, CancellationToken cancellationToken);
        Task<IReadOnlyList<Wishlist>> GetByComponentIdAsync(ComponentId componentId, CancellationToken cancellationToken);
        Task<IReadOnlyList<Wishlist>> GetByUserAsync(UserId userId, CancellationToken cancellationToken);
    }
}
