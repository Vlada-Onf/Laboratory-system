using Domain.Wishlists.Importance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.WishlistsImportance.Exceptions
{
    public abstract class WishlistImportanceException(
            WishlistImportanceId id,
            string message,
            Exception? innerException = null)
            : Exception(message, innerException)
    {
        public WishlistImportanceId Id { get; } = id;
    }

    public sealed class WishlistImportanceNotFoundException(WishlistImportanceId id)
        : WishlistImportanceException(id, $"Wishlist importance not found under id {id}");

    public sealed class WishlistImportanceAlreadyExistForLevelException(int level)
        : WishlistImportanceException(WishlistImportanceId.Empty(),
            $"Wishlist importance already exists for level {level}");

    public sealed class UnhandledWishlistImportanceException(
        WishlistImportanceId id,
        Exception? innerException = null)
        : WishlistImportanceException(
            id,
            innerException is null
                ? "Unexpected error occurred"
                : $"Unexpected error occurred: {innerException.Message}",
            innerException);

}
