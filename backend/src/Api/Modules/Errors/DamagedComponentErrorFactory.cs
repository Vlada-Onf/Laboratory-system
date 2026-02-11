using Application.DamagedComponents.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class DamagedComponentErrorFactory
    {
        public static ObjectResult ToObjectResult(this DamagedComponentException error)
        {
            return new ObjectResult(error.Message)
            {
                StatusCode = error switch
                {
                    DamagedComponentNotFoundException => StatusCodes.Status404NotFound,
                    DamagedComponentReasonNotFoundException => StatusCodes.Status404NotFound,
                    UnhandledDamagedComponentException => StatusCodes.Status500InternalServerError,
                    _ => StatusCodes.Status500InternalServerError
                }
            };
        }
    }
}
