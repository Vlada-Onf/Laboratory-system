using Domain.Wishlists;

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
        : WishlistException(
            id,
            innerException is null
                ? "Unexpected error occurred"
                : $"Unexpected error occurred: {innerException.Message}",
            innerException);
}
