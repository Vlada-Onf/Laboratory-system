using Domain.DashboardStatistics;
using Domain.DashboardStatistics.DashboardStatistics;
using Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Configurations
{
    public class DashboardStatisticConfiguration : IEntityTypeConfiguration<DashboardStatistic>
    {
        public void Configure(EntityTypeBuilder<DashboardStatistic> builder)
        {
            builder.ToTable("dashboard_statistics");

            builder.HasKey(ds => ds.Id);

            builder.Property(ds => ds.Id)
                .HasConversion(x => x.Value, x => new DashboardStatisticsId(x))
                .HasColumnName("id");

            builder.Property(ds => ds.StatisticDate)
                .HasConversion(new DateTimeUtcConverter())
                .HasColumnName("statistic_date")
                .IsRequired();

            builder.Property(ds => ds.TotalComponentsCount)
                .HasColumnName("total_components_count")
                .IsRequired();

            builder.Property(ds => ds.TotalComponentsCost)
                .HasColumnType("decimal(18,2)")
                .HasColumnName("total_components_cost")
                .IsRequired();

            builder.Property(ds => ds.TotalDecommissionedCount)
                .HasColumnName("total_decommissioned_count")
                .IsRequired();

            builder.Property(ds => ds.UpdatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("updated_at")
                .IsRequired();

            builder.HasIndex(ds => ds.StatisticDate)
                .IsUnique()
                .HasDatabaseName("ix_dashboard_statistics_statistic_date_unique");

            builder.HasIndex(ds => ds.UpdatedAt)
                .HasDatabaseName("ix_dashboard_statistics_updated_at");
        }
    }
}
