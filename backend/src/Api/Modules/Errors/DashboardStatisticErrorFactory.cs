using Application.DashboardStatistics.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Modules.Errors
{
    public static class DashboardStatisticErrorFactory
    {
        public static ObjectResult ToObjectResult(this DashboardStatisticException error)
        {
            return new ObjectResult(error.Message)
            {
                StatusCode = error switch
                {
                    DashboardStatisticAlreadyExistForDateException => StatusCodes.Status409Conflict,
                    DashboardStatisticNotFoundException => StatusCodes.Status404NotFound,
                    UnhandledDashboardStatisticException => StatusCodes.Status500InternalServerError,
                    _ => throw new NotImplementedException(
                        $"DashboardStatistic error handler not implemented for {error.GetType().Name}")
                }
            };
        }
    }
}
