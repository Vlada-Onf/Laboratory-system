using Domain.DashboardStatistics;
using Domain.DashboardStatistics.DashboardStatistics;
using LanguageExt;

namespace Application.Common.Interfaces.Queries
{
    public interface IDashboardStatisticQueries
    {
        Task<Option<DashboardStatistic>> GetByIdAsync(DashboardStatisticsId id, CancellationToken cancellationToken);
        Task<Option<DashboardStatistic>> GetByDateAsync(DateTime date, CancellationToken cancellationToken);
        Task<IReadOnlyList<DashboardStatistic>> GetAllAsync(CancellationToken cancellationToken);
        Task<IReadOnlyList<DashboardStatistic>> GetByDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken);
        Task<Option<DashboardStatistic>> GetLatestAsync(CancellationToken cancellationToken);
    }
}
