using Domain.Components;
using Domain.Needs;
using Domain.Needs.Importance;
using Domain.Needs.Status;
using Domain.Users;
using Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class NeedConfiguration : IEntityTypeConfiguration<Need>
    {
        public void Configure(EntityTypeBuilder<Need> builder)
        {
            builder.ToTable("needs");

            builder.HasKey(n => n.Id);

            builder.Property(n => n.Id)
                .HasConversion(x => x.Value, x => new NeedId(x))
                .HasColumnName("id");

            builder.Property(n => n.ComponentId)
                .HasConversion(x => x.Value, x => new ComponentId(x))
                .HasColumnName("component_id")
                .IsRequired();

            builder.Property(n => n.QuantityNeeded)
                .HasColumnName("quantity_needed")
                .IsRequired();

            builder.Property(n => n.RequestedBy)
                .HasConversion(x => x.Value, x => new UserId(x))
                .HasColumnName("requested_by")
                .IsRequired();

            builder.Property(n => n.RequestedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("requested_at")
                .IsRequired();

            builder.Property(n => n.Description)
                .HasColumnType("varchar(1000)")
                .HasColumnName("description");

            builder.Property(n => n.CompletedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasColumnName("completed_at");

            builder.Property(n => n.CompletionReason)
                .HasColumnType("varchar(1000)")
                .HasColumnName("completion_reason");

            builder.Property(n => n.ImportanceId)
                .HasConversion(x => x.Value, x => new NeedImportanceId(x))
                .HasColumnName("importance_id")
                .IsRequired();

            builder.Property(n => n.StatusId)
                .HasConversion(x => x.Value, x => new NeedStatusId(x))
                .HasColumnName("status_id")
                .IsRequired();

            builder.HasOne<Component>()
                .WithMany()
                .HasForeignKey(n => n.ComponentId)
                .HasConstraintName("fk_needs_components_id")
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne<NeedImportance>()
                .WithMany()
                .HasForeignKey(n => n.ImportanceId)
                .HasConstraintName("fk_needs_importance_id")
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne<NeedStatus>()
                .WithMany()
                .HasForeignKey(n => n.StatusId)
                .HasConstraintName("fk_needs_status_id")
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(n => n.ComponentId)
                .HasDatabaseName("ix_needs_component_id");

            builder.HasIndex(n => n.RequestedBy)
                .HasDatabaseName("ix_needs_requested_by");
        }
    }
}
