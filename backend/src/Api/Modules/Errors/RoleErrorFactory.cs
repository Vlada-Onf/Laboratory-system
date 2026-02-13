using Application.Roles.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class RoleErrorFactory
    {
        public static ObjectResult ToObjectResult(this RoleException error)
        {
            return new ObjectResult(error.Message)
            {
                StatusCode = error switch
                {
                    RoleAlreadyExistException => StatusCodes.Status409Conflict,
                    RoleNotFoundException => StatusCodes.Status404NotFound,
                    UnhandledRoleException => StatusCodes.Status500InternalServerError,
                    _ => throw new NotImplementedException(
                        $"Role error handler not implemented for {error.GetType().Name}")
                }
            };
        }
    }
}
