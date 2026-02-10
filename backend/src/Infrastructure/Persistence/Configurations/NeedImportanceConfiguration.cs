using Domain.Needs.Importance;
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
    public class NeedImportanceConfiguration : IEntityTypeConfiguration<NeedImportance>
    {
        public void Configure(EntityTypeBuilder<NeedImportance> builder)
        {
            builder.ToTable("need_importances");

            builder.HasKey(ni => ni.Id);

            builder.Property(ni => ni.Id)
                .HasConversion(x => x.Value, x => new NeedImportanceId(x))
                .HasColumnName("id");

            builder.Property(ni => ni.Name)
                .HasColumnType("varchar(255)")
                .HasColumnName("name")
                .IsRequired();

            builder.Property(ni => ni.Level)
                .HasColumnName("level")
                .IsRequired();

            builder.Property(ni => ni.CreatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("created_at")
                .IsRequired();

            builder.HasIndex(ni => ni.Name)
                .IsUnique()
                .HasDatabaseName("ix_need_importances_name_unique");

            builder.HasIndex(ni => ni.Level)
                .HasDatabaseName("ix_need_importances_level");
        }
    }
}
