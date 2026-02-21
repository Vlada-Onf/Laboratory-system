using Application.SchematicsUsefulLinks.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class SchematicUsefulLinkErrorFactory
    {
        public static ObjectResult ToObjectResult(this SchematicUsefulLinkException ex)
        {
            return ex switch
            {
                SchematicUsefulLinkNotFoundException => new NotFoundObjectResult(new
                {
                    error = ex.Message
                }),
                _ => new ObjectResult(new
                {
                    error = ex.Message
                })
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                }
            };
        }
    }
}
