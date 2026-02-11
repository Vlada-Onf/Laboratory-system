using Domain.Categories;
using Domain.Components;
using Domain.Tags;
using Domain.Users;
using Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class ComponentConfiguration : IEntityTypeConfiguration<Component>
    {
        public void Configure(EntityTypeBuilder<Component> builder)
        {
            builder.ToTable("components");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.Id)
                .HasConversion(x => x.Value, x => new ComponentId(x))
                .HasColumnName("id");

            builder.Property(c => c.CategoryId)
                .HasConversion(x => x.Value, x => new CategoryId(x))
                .HasColumnName("category_id")
                .IsRequired();

            builder.Property(c => c.Name)
                .HasColumnType("varchar(255)")
                .HasColumnName("name")
                .IsRequired();

            builder.Property(c => c.Description)
                .HasColumnType("varchar(2000)")
                .HasColumnName("description");

            builder.Property(c => c.Quantity)
                .HasColumnName("quantity")
                .IsRequired();

            builder.Property(c => c.Price)
                .HasColumnType("decimal(18,2)")
                .HasColumnName("price")
                .IsRequired();

            builder.Property(c => c.TotalCost)
                .HasColumnType("decimal(18,2)")
                .HasColumnName("total_cost")
                .IsRequired();

            builder.Property(c => c.PhotoUrl)
                .HasColumnType("varchar(500)")
                .HasColumnName("photo_url")
                .IsRequired();

            builder.Property(c => c.SupplierLink)
                .HasColumnType("varchar(500)")
                .HasColumnName("supplier_link")
                .IsRequired();

            builder.Property(c => c.DocumentationLink)
                .HasColumnType("varchar(500)")
                .HasColumnName("documentation_link");

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

            builder.HasMany(c => c.Comments)
                .WithOne()
                .HasForeignKey("ComponentId")
                .HasConstraintName("fk_component_comments_components_id")
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(c => c.UsefulLinks)
                .WithOne()
                .HasForeignKey("ComponentId")
                .HasConstraintName("fk_component_useful_links_components_id")
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(c => c.Tags)
                .WithMany()
                .UsingEntity<Dictionary<string, object>>(
                    "component_tags",
                    j => j.HasOne<Tag>()
                        .WithMany()
                        .HasForeignKey("tag_id")
                        .HasConstraintName("fk_component_tags_tags_id")
                        .OnDelete(DeleteBehavior.Cascade),
                    j => j.HasOne<Component>()
                        .WithMany()
                        .HasForeignKey("component_id")
                        .HasConstraintName("fk_component_tags_components_id")
                        .OnDelete(DeleteBehavior.Cascade));

            builder.HasIndex(c => c.Name).HasDatabaseName("ix_components_name");
            builder.HasIndex(c => c.CategoryId).HasDatabaseName("ix_components_category_id");
        }
    }
}
