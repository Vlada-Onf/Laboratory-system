using Application.EntityTypes.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class EntityTypeErrorFactory
    {
        public static ObjectResult ToObjectResult(this EntityTypeException error)
        {
            return new ObjectResult(error.Message)
            {
                StatusCode = error switch
                {
                    EntityTypeAlreadyExistException => StatusCodes.Status409Conflict,
                    EntityTypeNotFoundException => StatusCodes.Status404NotFound,
                    UnhandledEntityTypeException => StatusCodes.Status500InternalServerError,
                    _ => throw new NotImplementedException(
                        $"EntityType error handler not implemented for {error.GetType().Name}")
                }
            };
        }
    }
}
