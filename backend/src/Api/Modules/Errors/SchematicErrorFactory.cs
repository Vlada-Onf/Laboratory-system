using Application.Schematics.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class SchematicErrorFactory
    {
        public static ObjectResult ToObjectResult(this SchematicException error)
        {
            return new ObjectResult(error.Message)
            {
                StatusCode = error switch
                {
                    SchematicNotFoundException => StatusCodes.Status404NotFound,
                    UnhandledSchematicException => StatusCodes.Status500InternalServerError,
                    _ => throw new NotImplementedException(
                        $"Schematic error handler not implemented for {error.GetType().Name}")
                }
            };
        }
    }
}
