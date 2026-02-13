using Application.Comment.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class ComponentCommentErrorFactory
    {
        public static ObjectResult ToObjectResult(this ComponentCommentException error)
        {
            return new ObjectResult(error.Message)
            {
                StatusCode = error switch
                {
                    ComponentCommentNotFoundException => StatusCodes.Status404NotFound,
                    UnhandledComponentCommentException => StatusCodes.Status500InternalServerError,
                    _ => throw new NotImplementedException(
                        $"Comment error handler not implemented for {error.GetType().Name}")
                }
            };
        }
    }
}
