using Domain.DashboardStatistics;

namespace Api.Dtos
{
    public record DashboardStatisticDto(
        Guid Id,
        DateTime StatisticDate,
        int TotalComponentsCount,
        decimal TotalComponentsCost,
        int TotalDecommissionedCount,
        DateTime UpdatedAt)
    {
        public static DashboardStatisticDto FromDomainModel(DashboardStatistic statistic)
            => new(
                statistic.Id.Value,
                statistic.StatisticDate,
                statistic.TotalComponentsCount,
                statistic.TotalComponentsCost,
                statistic.TotalDecommissionedCount,
                statistic.UpdatedAt);
    }

    public record CreateDashboardStatisticDto
    {
    public required DateTime StatisticDate { get; init; }
    }

    public record UpdateDashboardStatisticDto
    {
        public required Guid Id { get; init; }
    }

}
