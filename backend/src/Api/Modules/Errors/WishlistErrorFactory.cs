using Application.Wishlists.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class WishlistErrorFactory
    {
        public static ObjectResult ToObjectResult(this WishlistException error)
        {
            return new ObjectResult(error.Message)
            {
                StatusCode = error switch
                {
                    WishlistNotFoundException => StatusCodes.Status404NotFound,
                    UnhandledWishlistException => StatusCodes.Status500InternalServerError,
                    _ => throw new NotImplementedException(
                        $"Wishlist error handler not implemented for {error.GetType().Name}")
                }
            };
        }
    }
}
