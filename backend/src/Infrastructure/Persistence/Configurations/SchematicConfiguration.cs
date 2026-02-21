using Domain.Components;
using Domain.Schematics;
using Domain.Schematics.Schematics;
using Domain.Schematics.UsefulLink;
using Domain.Users;
using Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class SchematicConfiguration : IEntityTypeConfiguration<Schematic>
    {
        public void Configure(EntityTypeBuilder<Schematic> builder)
        {
            builder.ToTable("schematics");

            builder.HasKey(s => s.Id);

            builder.Property(s => s.Id)
                .HasConversion(x => x.Value, x => new SchematicId(x))
                .HasColumnName("id");

            builder.Property(s => s.ComponentId)
                .HasConversion(x => x.Value, x => new ComponentId(x))
                .HasColumnName("component_id")
                .IsRequired();

            builder.Property(s => s.Title)
                .HasColumnType("varchar(255)")
                .HasColumnName("title")
                .IsRequired();

            builder.Property(s => s.Description)
                .HasColumnType("varchar(2000)")
                .HasColumnName("description");

            builder.Property(s => s.PhotoUrl)
                .HasColumnType("varchar(500)")
                .HasColumnName("photo_url");

            builder.Property(s => s.DocumentUrl)
                .HasColumnType("varchar(500)")
                .HasColumnName("document_url");

            builder.Property(s => s.SchematicUsefulLinkId)
                .HasConversion(x => x.Value, x => new SchematicUsefulLinkId(x))
                .HasColumnName("schematic_useful_link_id");

            builder.Property(s => s.CreatedBy)
                .HasConversion(x => x.Value, x => new UserId(x))
                .HasColumnName("created_by")
                .IsRequired();

            builder.Property(s => s.CreatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("created_at")
                .IsRequired();

            builder.Property(s => s.UpdatedBy)
                .HasConversion(x => x.Value, x => new UserId(x))
                .HasColumnName("updated_by");

            builder.Property(s => s.UpdatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasColumnName("updated_at");

            builder.HasOne<Component>()
                .WithMany()
                .HasForeignKey(s => s.ComponentId)
                .HasConstraintName("fk_schematics_components_id")
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(s => s.ComponentId)
                .HasDatabaseName("ix_schematics_component_id");
        }
    }
}
