using Domain.Wishlists.Importance;
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
    public class WishlistImportanceConfiguration : IEntityTypeConfiguration<WishlistImportance>
    {
        public void Configure(EntityTypeBuilder<WishlistImportance> builder)
        {
            builder.ToTable("wishlist_importances");

            builder.HasKey(wi => wi.Id);

            builder.Property(wi => wi.Id)
                .HasConversion(x => x.Value, x => new WishlistImportanceId(x))
                .HasColumnName("id");

            builder.Property(wi => wi.Name)
                .HasColumnType("varchar(255)")
                .HasColumnName("name")
                .IsRequired();

            builder.Property(wi => wi.Level)
                .HasColumnName("level")
                .IsRequired();

            builder.Property(wi => wi.CreatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("created_at")
                .IsRequired();

            builder.HasIndex(wi => wi.Name)
                .IsUnique()
                .HasDatabaseName("ix_wishlist_importances_name_unique");

            builder.HasIndex(wi => wi.Level)
                .HasDatabaseName("ix_wishlist_importances_level");
        }
    }
}
