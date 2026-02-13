using Domain.Wishlists.Status;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.WishlistsStatus.Exceptions
{
    public abstract class WishlistStatusException(
            WishlistStatusId id,
            string message,
            Exception? innerException = null)
            : Exception(message, innerException)
    {
        public WishlistStatusId Id { get; } = id;
    }

    public sealed class WishlistStatusNotFoundException(WishlistStatusId id)
        : WishlistStatusException(id, $"Wishlist status not found under id {id}");

    public sealed class UnhandledWishlistStatusException(
        WishlistStatusId id,
        Exception? innerException = null)
        : WishlistStatusException(id, "Unexpected error occurred", innerException);
}
