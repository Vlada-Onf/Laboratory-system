using Domain.DashboardStatistics.DashboardStatistics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DashboardStatistics.Exceptions
{
    public abstract class DashboardStatisticException(
        DashboardStatisticsId id,
        string message,
        Exception? innerException = null)
        : Exception(message, innerException)
    {
        public DashboardStatisticsId Id { get; } = id;
    }

    public sealed class DashboardStatisticNotFoundException(DashboardStatisticsId id)
        : DashboardStatisticException(id, $"Dashboard statistic not found under id {id}");

    public sealed class DashboardStatisticAlreadyExistForDateException(DateTime date)
        : DashboardStatisticException(DashboardStatisticsId.Empty(),
            $"Dashboard statistic already exists for date {date:yyyy-MM-dd}");

    public sealed class UnhandledDashboardStatisticException(
        DashboardStatisticsId id,
        Exception? innerException = null)
        : DashboardStatisticException(id, "Unexpected error occurred", innerException);
}