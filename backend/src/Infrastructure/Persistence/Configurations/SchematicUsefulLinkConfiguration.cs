using Domain.Schematics;
using Domain.Schematics.Schematics;
using Domain.Schematics.UsefulLink;
using Domain.Users;
using Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class SchematicUsefulLinkConfiguration : IEntityTypeConfiguration<SchematicUsefulLink>
    {
        public void Configure(EntityTypeBuilder<SchematicUsefulLink> builder)
        {
            builder.ToTable("schematic_useful_links");

            builder.HasKey(l => l.Id);

            builder.Property(l => l.Id)
                .HasConversion(x => x.Value, x => new SchematicUsefulLinkId(x))
                .HasColumnName("id");

            builder.Property(l => l.SchematicId)
                .HasConversion(x => x.Value, x => new SchematicId(x))
                .HasColumnName("schematic_id")
                .IsRequired();

            builder.Property(l => l.Title)
                .HasColumnType("varchar(255)")
                .HasColumnName("title")
                .IsRequired();

            builder.Property(l => l.Url)
                .HasColumnType("varchar(1000)")
                .HasColumnName("url")
                .IsRequired();

            builder.Property(l => l.CreatedBy)
                .HasConversion(x => x.Value, x => new UserId(x))
                .HasColumnName("created_by")
                .IsRequired();

            builder.Property(l => l.CreatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("created_at")
                .IsRequired();

            builder.Property(l => l.LastUpdatedBy)
                .HasConversion(x => x.Value, x => new UserId(x))
                .HasColumnName("last_updated_by");

            builder.Property(l => l.LastUpdatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasColumnName("last_updated_at");

            builder.HasOne<Schematic>()
                .WithMany()
                .HasForeignKey(l => l.SchematicId)
                .HasConstraintName("fk_schematic_useful_links_schematics_id")
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(l => l.SchematicId)
                .HasDatabaseName("ix_schematic_useful_links_schematic_id");
        }
    }
}
