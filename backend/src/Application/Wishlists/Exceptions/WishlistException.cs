using Domain.Wishlists;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Wishlists.Exceptions
{
    public abstract class WishlistException(
            WishlistId id,
            string message,
            Exception? innerException = null)
            : Exception(message, innerException)
    {
        public WishlistId Id { get; } = id;
    }

    public sealed class WishlistNotFoundException(WishlistId id)
        : WishlistException(id, $"Wishlist not found under id {id}");

    public sealed class UnhandledWishlistException(
        WishlistId id,
        Exception? innerException = null)
        : WishlistException(id, "Unexpected error occurred", innerException);
}
