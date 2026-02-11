using Domain.DashboardStatistics.DashboardStatistics;

namespace Domain.DashboardStatistics
{
    public class DashboardStatistic
    {
        public DashboardStatisticsId Id { get; }
        public DateTime StatisticDate { get; private set; }
        public int TotalComponentsCount { get; private set; }
        public decimal TotalComponentsCost { get; private set; }
        public int TotalDecommissionedCount { get; private set; }
        public DateTime UpdatedAt { get; private set; }
        private DashboardStatistic(
            DashboardStatisticsId id,
            DateTime statisticDate,
            int totalComponentsCount,
            decimal totalComponentsCost,
            int totalDecommissionedCount,
            DateTime updatedAt)
        {
            if (totalComponentsCount < 0)
                throw new ArgumentException("Загальна кількість компонентів не може бути негативною");

            if (totalComponentsCost < 0)
                throw new ArgumentException("Загальна вартість компонентів не може бути негативною");

            if (totalDecommissionedCount < 0)
                throw new ArgumentException("Виведені з експлуатації компоненти не можуть бути негативними");

            Id = id;
            StatisticDate = statisticDate;
            TotalComponentsCount = totalComponentsCount;
            TotalComponentsCost = totalComponentsCost;
            TotalDecommissionedCount = totalDecommissionedCount;
            UpdatedAt = updatedAt;
        }

        public static DashboardStatistic Create(
            DateTime statisticDate,
            int totalComponentsCount,
            decimal totalComponentsCost,
            int totalDecommissionedCount)
        {
            return new DashboardStatistic(
                DashboardStatisticsId.New(),
                statisticDate,
                totalComponentsCount,
                totalComponentsCost,
                totalDecommissionedCount,
                DateTime.UtcNow);
        }

        public void Update(
            int totalComponentsCount,
            decimal totalComponentsCost,
            int totalDecommissionedCount)
        {
            if (totalComponentsCount < 0)
                throw new ArgumentException("Загальна кількість компонентів не може бути негативною");

            if (totalComponentsCost < 0)
                throw new ArgumentException("Загальна вартість компонентів не може бути негативною");

            if (totalDecommissionedCount < 0)
                throw new ArgumentException("Виведені з експлуатації компоненти не можуть бути негативними");

            TotalComponentsCount = totalComponentsCount;
            TotalComponentsCost = totalComponentsCost;
            TotalDecommissionedCount = totalDecommissionedCount;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
