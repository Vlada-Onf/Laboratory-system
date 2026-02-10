using Domain.DamagedComponents.Reason;
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
    public class DamagedComponentReasonConfiguration : IEntityTypeConfiguration<DamagedComponentReason>
    {
        public void Configure(EntityTypeBuilder<DamagedComponentReason> builder)
        {
            builder.ToTable("damaged_component_reasons");
            builder.HasKey(r => r.Id);

            builder.Property(r => r.Id)
                .HasConversion(x => x.Value, x => new DamagedComponentReasonId(x))
                .HasColumnName("id");

            builder.Property(r => r.Name)
                .HasColumnType("varchar(255)")
                .HasColumnName("name")
                .IsRequired();

            builder.Property(r => r.Description)
                .HasColumnType("varchar(2000)")
                .HasColumnName("description");

            builder.Property(r => r.CreatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("created_at")
                .IsRequired();

            builder.HasIndex(r => r.Name)
                .IsUnique()
                .HasDatabaseName("ix_damaged_component_reasons_name_unique");
        }
    }
}
