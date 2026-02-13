using Application.WishlistsStatus.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class WishlistStatusErrorFactory
    {
        public static ObjectResult ToObjectResult(this WishlistStatusException error)
        {
            return new ObjectResult(error.Message)
            {
                StatusCode = error switch
                {
                    WishlistStatusNotFoundException => StatusCodes.Status404NotFound,
                    UnhandledWishlistStatusException => StatusCodes.Status500InternalServerError,
                    _ => throw new NotImplementedException(
                        $"WishlistStatus error handler not implemented for {error.GetType().Name}")
                }
            };
        }
    }
}
