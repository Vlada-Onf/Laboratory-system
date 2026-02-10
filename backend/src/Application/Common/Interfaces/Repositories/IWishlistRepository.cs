using Domain.Wishlists;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Repositories
{
    public interface IWishlistRepository
    {
        Task<Wishlist> AddAsync(Wishlist wishlist, CancellationToken cancellationToken);
        Task<Wishlist> UpdateAsync(Wishlist wishlist, CancellationToken cancellationToken);
        Task<Wishlist> DeleteAsync(Wishlist wishlist, CancellationToken cancellationToken);
    }
}
