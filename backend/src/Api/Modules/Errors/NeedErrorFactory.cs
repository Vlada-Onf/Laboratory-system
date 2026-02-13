using Application.Needs.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class NeedErrorFactory
    {
        public static ObjectResult ToObjectResult(this NeedException error)
        {
            return new ObjectResult(error.Message)
            {
                StatusCode = error switch
                {
                    NeedNotFoundException => StatusCodes.Status404NotFound,
                    UnhandledNeedException => StatusCodes.Status500InternalServerError,
                    _ => throw new NotImplementedException(
                        $"Need error handler not implemented for {error.GetType().Name}")
                }
            };
        }
    }
}
