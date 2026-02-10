using Domain.Components;
using Domain.Users;
using Domain.Wishlists;
using Domain.Wishlists.Importance;
using Domain.Wishlists.Status;
using Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class WishlistConfiguration : IEntityTypeConfiguration<Wishlist>
    {
        public void Configure(EntityTypeBuilder<Wishlist> builder)
        {
            builder.ToTable("wishlists");

            builder.HasKey(w => w.Id);

            builder.Property(w => w.Id)
                .HasConversion(x => x.Value, x => new WishlistId(x))
                .HasColumnName("id");

            builder.Property(w => w.ComponentId)
                .HasConversion(x => x.Value, x => new ComponentId(x))
                .HasColumnName("component_id")
                .IsRequired();

            builder.Property(w => w.Name)
                .HasColumnType("varchar(255)")
                .HasColumnName("name")
                .IsRequired();

            builder.Property(w => w.Description)
                .HasColumnType("varchar(1000)")
                .HasColumnName("description");

            builder.Property(w => w.QuantityNeeded)
                .HasColumnName("quantity_needed")
                .IsRequired();

            builder.Property(w => w.RequestedBy)
                .HasConversion(x => x.Value, x => new UserId(x))   // 👈 додали конвертер
                .HasColumnName("requested_by")
                .IsRequired();

            builder.Property(w => w.RequestedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("requested_at")
                .IsRequired();

            builder.Property(w => w.ImportanceId)
                .HasConversion(x => x.Value, x => new WishlistImportanceId(x))
                .HasColumnName("importance_id")
                .IsRequired();

            builder.Property(w => w.StatusId)
                .HasConversion(x => x.Value, x => new WishlistStatusId(x))
                .HasColumnName("status_id")
                .IsRequired();

            builder.Property(w => w.CompletedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasColumnName("completed_at");

            builder.Property(w => w.CompletionReason)
                .HasColumnType("varchar(1000)")
                .HasColumnName("completion_reason");

            builder.HasOne<Component>()
                .WithMany()
                .HasForeignKey(w => w.ComponentId)
                .HasConstraintName("fk_wishlists_components_id")
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne<WishlistImportance>()
                .WithMany()
                .HasForeignKey(w => w.ImportanceId)
                .HasConstraintName("fk_wishlists_importances_id")
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne<WishlistStatus>()
                .WithMany()
                .HasForeignKey(w => w.StatusId)
                .HasConstraintName("fk_wishlists_statuses_id")
                .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne<User>()
                .WithMany()
                .HasForeignKey(w => w.RequestedBy)
                .HasConstraintName("fk_wishlists_users_requested_by")
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(w => w.ComponentId)
                .HasDatabaseName("ix_wishlists_component_id");

            builder.HasIndex(w => w.RequestedBy)
                .HasDatabaseName("ix_wishlists_requested_by");
        }
    }
}
