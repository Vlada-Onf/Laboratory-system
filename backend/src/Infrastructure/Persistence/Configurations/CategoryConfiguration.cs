using Domain.Categories;
using Domain.Users;
using Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.ToTable("categories");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.Id)
                .HasConversion(x => x.Value, x => new CategoryId(x))
                .HasColumnName("id");

            builder.Property(c => c.Name)
                .HasColumnType("varchar(255)")
                .HasColumnName("name")
                .IsRequired();

            builder.Property(c => c.Description)
                .HasColumnType("varchar(2000)")
                .HasColumnName("description");

            builder.Property(c => c.PhotoUrl)
                .HasColumnType("varchar(500)")
                .HasColumnName("photo_url");

            builder.Property(c => c.CardColor)
                .HasColumnType("varchar(50)")
                .HasColumnName("card_color");

            builder.Property(c => c.CreatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("created_at")
                .IsRequired();

            builder.Property(c => c.CreatedBy)
                .HasConversion(x => x.Value, x => new UserId(x))
                .HasColumnName("created_by")
                .IsRequired();

            builder.Property(c => c.LastUpdatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasColumnName("last_updated_at");

            builder.Property(c => c.LastUpdatedBy)
                .HasConversion(x => x.Value, x => new UserId(x))
                .HasColumnName("last_updated_by");

            builder.HasIndex(c => c.Name)
                .IsUnique()
                .HasDatabaseName("ix_categories_name_unique");
        }
    }
}
