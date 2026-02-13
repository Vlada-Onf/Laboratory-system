using Application.WishlistsImportance.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class WishlistImportanceErrorFactory
    {
        public static ObjectResult ToObjectResult(this WishlistImportanceException error)
        {
            return new ObjectResult(error.Message)
            {
                StatusCode = error switch
                {
                    WishlistImportanceAlreadyExistForLevelException => StatusCodes.Status409Conflict,
                    WishlistImportanceNotFoundException => StatusCodes.Status404NotFound,
                    UnhandledWishlistImportanceException => StatusCodes.Status500InternalServerError,
                    _ => throw new NotImplementedException(
                        $"WishlistImportance error handler not implemented for {error.GetType().Name}")
                }
            };
        }
    }
}
