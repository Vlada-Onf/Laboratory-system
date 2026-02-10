using Domain.Wishlists.Status;
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
    public class WishlistStatusConfiguration : IEntityTypeConfiguration<WishlistStatus>
    {
        public void Configure(EntityTypeBuilder<WishlistStatus> builder)
        {
            builder.ToTable("wishlist_statuses");

            builder.HasKey(ws => ws.Id);

            builder.Property(ws => ws.Id)
                .HasConversion(x => x.Value, x => new WishlistStatusId(x))
                .HasColumnName("id");

            builder.Property(ws => ws.Name)
                .HasColumnType("varchar(255)")
                .HasColumnName("name")
                .IsRequired();

            builder.Property(ws => ws.Description)
                .HasColumnType("varchar(1000)")
                .HasColumnName("description");

            builder.Property(ws => ws.CreatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("created_at")
                .IsRequired();

            builder.HasIndex(ws => ws.Name)
                .IsUnique()
                .HasDatabaseName("ix_wishlist_statuses_name_unique");
        }
    }
}
