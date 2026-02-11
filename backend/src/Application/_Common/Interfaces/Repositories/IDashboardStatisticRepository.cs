using Domain.DashboardStatistics;
using Domain.DashboardStatistics.DashboardStatistics;
using LanguageExt;

namespace Application.Common.Interfaces.Repositories
{
    public interface IDashboardStatisticRepository
    {
        Task<DashboardStatistic> AddAsync(DashboardStatistic statistic, CancellationToken cancellationToken);
        Task<DashboardStatistic> UpdateAsync(DashboardStatistic statistic, CancellationToken cancellationToken);
        Task<DashboardStatistic> DeleteAsync(DashboardStatistic statistic, CancellationToken cancellationToken);

        Task<Option<DashboardStatistic>> GetByIdAsync(DashboardStatisticsId id, CancellationToken cancellationToken);
        Task<Option<DashboardStatistic>> GetByDateAsync(DateTime date, CancellationToken cancellationToken);
    }
}
