using Application.DamagedComponentReasons.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class DamagedComponentReasonErrorFactory
    {
        public static ObjectResult ToObjectResult(this DamagedComponentReasonException error)
        {
            return new ObjectResult(error.Message)
            {
                StatusCode = error switch
                {
                    DamagedComponentReasonNotFoundException => StatusCodes.Status404NotFound,
                    UnhandledDamagedComponentReasonException => StatusCodes.Status500InternalServerError,
                    _ => throw new NotImplementedException(
                        $"DamagedComponentReason error handler not implemented for {error.GetType().Name}")
                }
            };
        }
    }
}
