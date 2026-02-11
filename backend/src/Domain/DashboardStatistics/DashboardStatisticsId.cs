namespace Domain.DashboardStatistics.DashboardStatistics
{
    public record DashboardStatisticsId(Guid Value)
    {
        public static DashboardStatisticsId Empty() => new(Guid.Empty);
        public static DashboardStatisticsId New() => new(Guid.NewGuid());
        public override string ToString() => Value.ToString();
    }
}
