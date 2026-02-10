using Domain.Components;
using Domain.DamagedComponents;
using Domain.DamagedComponents.Reason;
using Domain.Users;
using Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class DamagedComponentConfiguration : IEntityTypeConfiguration<DamagedComponent>
    {
        public void Configure(EntityTypeBuilder<DamagedComponent> builder)
        {
            builder.ToTable("damaged_components");

            builder.HasKey(dc => dc.Id);

            builder.Property(dc => dc.Id)
                .HasConversion(x => x.Value, x => new DamagedComponentId(x))
                .HasColumnName("id");

            builder.Property(dc => dc.ComponentId)
                .HasConversion(x => x.Value, x => new ComponentId(x))
                .HasColumnName("component_id")
                .IsRequired();

            builder.Property(dc => dc.ReasonId)
                .HasConversion(x => x.Value, x => new DamagedComponentReasonId(x))
                .HasColumnName("reason_id")
                .IsRequired();

            builder.Property(dc => dc.Quantity)
                .HasColumnName("quantity")
                .IsRequired();

            builder.Property(dc => dc.RecordedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("recorded_at")
                .IsRequired();

            builder.Property(dc => dc.RecordedBy)
                .HasConversion(x => x.Value, x => new UserId(x))   // 👈 конвертер
                .HasColumnName("recorded_by")
                .IsRequired();

            builder.Property(dc => dc.LastUpdatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasColumnName("last_updated_at");

            builder.Property(dc => dc.LastUpdatedBy)
                .HasConversion(x => x.Value, x => new UserId(x))   // 👈 конвертер
                .HasColumnName("last_updated_by");

            builder.HasOne<Component>()
                .WithMany()
                .HasForeignKey(dc => dc.ComponentId)
                .HasConstraintName("fk_damaged_components_components_id")
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne<DamagedComponentReason>()
                .WithMany()
                .HasForeignKey(dc => dc.ReasonId)
                .HasConstraintName("fk_damaged_components_reasons_id")
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(dc => dc.ComponentId)
                .HasDatabaseName("ix_damaged_components_component_id");

            builder.HasIndex(dc => dc.ReasonId)
                .HasDatabaseName("ix_damaged_components_reason_id");
        }
    }
}
