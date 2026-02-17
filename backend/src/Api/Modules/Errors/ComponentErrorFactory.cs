using Application.Components.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class ComponentErrorFactory
    {
        public static ObjectResult ToObjectResult(this ComponentException error)
        {
            return new ObjectResult(error.Message)
            {
                StatusCode = error switch
                {
                    ComponentAlreadyExistException => StatusCodes.Status409Conflict,
                    ComponentNotFoundException or ComponentCategoryNotFoundException
                        => StatusCodes.Status404NotFound,
                    ComponentDeleteForbiddenException
                        => StatusCodes.Status409Conflict,
                    UnhandledComponentException
                        => StatusCodes.Status500InternalServerError,
                    _ => throw new NotImplementedException("Component error handler is not implemented")
                }
            };
        }
    }
}
