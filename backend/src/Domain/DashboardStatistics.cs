using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class DashboardStatistics
    {
        public Guid Id { get; }
        public DateTime StatisticDate { get; }
        public int TotalComponentsCount { get; }
        public decimal TotalComponentsCost { get; }
        public int TotalDecommissionedCount { get; }
        public DateTime UpdatedAt { get; }
        private DashboardStatistics( 
            Guid id,
            DateTime statisticDate,
            int totalComponentsCount,
            decimal totalComponentsCost,
            int totalDecommissionedCount,
            DateTime updatedAt)
        {
            Id = id;
            StatisticDate = statisticDate;
            TotalComponentsCount = totalComponentsCount;
            TotalComponentsCost = totalComponentsCost;
            TotalDecommissionedCount = totalDecommissionedCount;
            UpdatedAt = updatedAt;
        }

    }
}
