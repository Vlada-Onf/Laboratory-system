using Application.NeedsStatus.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class NeedStatusErrorFactory
    {
        public static ObjectResult ToObjectResult(this NeedStatusException error)
        {
            return new ObjectResult(error.Message)
            {
                StatusCode = error switch
                {
                    NeedStatusAlreadyExistException => StatusCodes.Status409Conflict,
                    NeedStatusNotFoundException => StatusCodes.Status404NotFound,
                    UnhandledNeedStatusException => StatusCodes.Status500InternalServerError,
                    _ => throw new NotImplementedException(
                        $"NeedStatus error handler not implemented for {error.GetType().Name}")
                }
            };
        }
    }
}
