using Application.HistoryEntries.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class HistoryErrorFactory
    {
        public static ObjectResult ToObjectResult(this HistoryException error)
        {
            return new ObjectResult(error.Message)
            {
                StatusCode = error switch
                {
                    UnhandledHistoryException => StatusCodes.Status500InternalServerError,
                    _ => throw new NotImplementedException(
                        $"History error handler not implemented for {error.GetType().Name}")
                }
            };
        }
    }
}
