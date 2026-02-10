using Application.Categories.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class CategoryErrorFactory
    {
        public static ObjectResult ToObjectResult(this CategoryException error)
        {
            return new ObjectResult(error.Message)
            {
                StatusCode = error switch
                {
                    CategoryAlreadyExistException => StatusCodes.Status409Conflict,
                    CategoryNotFoundException => StatusCodes.Status404NotFound,
                    UnhandledCategoryException => StatusCodes.Status500InternalServerError,
                    _ => throw new NotImplementedException("Category error handler is not implemented")
                }
            };
        }
    }
}
