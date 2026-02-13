using Application.UsefulLink.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class ComponentUsefulLinkErrorFactory
    {
        public static ObjectResult ToObjectResult(this ComponentUsefulLinkException error)
        {
            return new ObjectResult(error.Message)
            {
                StatusCode = error switch
                {
                    ComponentUsefulLinkNotFoundException => StatusCodes.Status404NotFound,
                    UnhandledComponentUsefulLinkException => StatusCodes.Status500InternalServerError,
                    _ => throw new NotImplementedException(
                        $"ComponentUsefulLink error handler not implemented for {error.GetType().Name}")
                }
            };
        }
    }
}
