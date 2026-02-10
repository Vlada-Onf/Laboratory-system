using Domain.Needs.Status;
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
    public class NeedStatusConfiguration : IEntityTypeConfiguration<NeedStatus>
    {
        public void Configure(EntityTypeBuilder<NeedStatus> builder)
        {
            builder.ToTable("need_statuses");

            builder.HasKey(ns => ns.Id);

            builder.Property(ns => ns.Id)
                .HasConversion(x => x.Value, x => new NeedStatusId(x))
                .HasColumnName("id");

            builder.Property(ns => ns.Name)
                .HasColumnType("varchar(255)")
                .HasColumnName("name")
                .IsRequired();

            builder.Property(ns => ns.Description)
                .HasColumnType("varchar(1000)")
                .HasColumnName("description");

            builder.Property(ns => ns.CreatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("created_at")
                .IsRequired();

            builder.HasIndex(ns => ns.Name)
                .IsUnique()
                .HasDatabaseName("ix_need_statuses_name_unique");
        }
    }
}
