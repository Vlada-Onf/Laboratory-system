using Application.NeedsImportance.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class NeedImportanceErrorFactory
    {
        public static ObjectResult ToObjectResult(this NeedImportanceException error)
        {
            return new ObjectResult(error.Message)
            {
                StatusCode = error switch
                {
                    NeedImportanceAlreadyExistForLevelException => StatusCodes.Status409Conflict,
                    NeedImportanceNotFoundException => StatusCodes.Status404NotFound,
                    UnhandledNeedImportanceException => StatusCodes.Status500InternalServerError,
                    _ => throw new NotImplementedException(
                        $"NeedImportance error handler not implemented for {error.GetType().Name}")
                }
            };
        }
    }
}
