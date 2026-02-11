using Application.Tags.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class TagErrorFactory
    {
        public static ObjectResult ToObjectResult(this TagException error)
        {
            return new ObjectResult(error.Message)
            {
                StatusCode = error switch
                {
                    TagNotFoundException => StatusCodes.Status404NotFound,
                    UnhandledTagException => StatusCodes.Status500InternalServerError,
                    _ => StatusCodes.Status500InternalServerError
                }
            };
        }
    }
}
