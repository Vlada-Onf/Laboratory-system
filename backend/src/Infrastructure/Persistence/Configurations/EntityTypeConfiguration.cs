using Domain.History.EntityTypes;
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
    public class EntityTypeConfiguration : IEntityTypeConfiguration<EntityType>
    {
        public void Configure(EntityTypeBuilder<EntityType> builder)
        {
            builder.ToTable("entity_types");

            builder.HasKey(et => et.Id);

            builder.Property(et => et.Id)
                .HasConversion(x => x.Value, x => new EntityTypeId(x))
                .HasColumnName("id");

            builder.Property(et => et.Name)
                .HasColumnType("varchar(255)")
                .HasColumnName("name")
                .IsRequired();

            builder.Property(et => et.Description)
                .HasColumnType("varchar(2000)")
                .HasColumnName("description");

            builder.Property(et => et.CreatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("created_at")
                .IsRequired();

            builder.HasIndex(et => et.Name)
                .IsUnique()
                .HasDatabaseName("ix_entity_types_name_unique");
        }
    }
}
