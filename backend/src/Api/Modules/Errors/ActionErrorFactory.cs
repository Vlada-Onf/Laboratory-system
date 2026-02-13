using Application.Actions.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class ActionErrorFactory
    {
        public static ObjectResult ToObjectResult(this ActionException error)
        {
            return new ObjectResult(error.Message)
            {
                StatusCode = error switch
                {
                    ActionAlreadyExistException => StatusCodes.Status409Conflict,
                    ActionNotFoundException => StatusCodes.Status404NotFound,
                    UnhandledActionException => StatusCodes.Status500InternalServerError,
                    _ => throw new NotImplementedException(
                        $"Action error handler does not implemented for {error.GetType().Name}")
                }
            };
        }
    }
}
