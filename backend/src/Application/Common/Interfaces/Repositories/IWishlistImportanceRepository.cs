using Domain.Wishlists.Importance;
using LanguageExt;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Repositories
{
    public interface IWishlistImportanceRepository
    {
        Task<WishlistImportance> AddAsync(WishlistImportance importance, CancellationToken cancellationToken);
        Task<WishlistImportance> UpdateAsync(WishlistImportance importance, CancellationToken cancellationToken);
        Task<Option<WishlistImportance>> GetByIdAsync(WishlistImportanceId id, CancellationToken cancellationToken);
    }
}
