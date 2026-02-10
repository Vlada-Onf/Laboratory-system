using Domain.Wishlists.Status;
using LanguageExt;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Repositories
{
    public interface IWishlistStatusRepository
    {
        Task<WishlistStatus> AddAsync(WishlistStatus status, CancellationToken cancellationToken);
        Task<WishlistStatus> UpdateAsync(WishlistStatus status, CancellationToken cancellationToken);
        Task<Option<WishlistStatus>> GetByIdAsync(WishlistStatusId id, CancellationToken cancellationToken);
    }
}
