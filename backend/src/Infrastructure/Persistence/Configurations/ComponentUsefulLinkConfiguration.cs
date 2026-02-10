using Domain.Components;
using Domain.Components.UsefulLink;
using Domain.Users;
using Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class ComponentUsefulLinkConfiguration : IEntityTypeConfiguration<ComponentUsefulLink>
    {
        public void Configure(EntityTypeBuilder<ComponentUsefulLink> builder)
        {
            builder.ToTable("component_useful_links");

            builder.HasKey(ul => ul.Id);

            builder.Property(ul => ul.Id)
                .HasConversion(x => x.Value, x => new ComponentUsefulLinkId(x))
                .HasColumnName("id");

            builder.Property(ul => ul.ComponentId)
                .HasConversion(x => x.Value, x => new ComponentId(x))
                .HasColumnName("component_id");

            builder.Property(ul => ul.Title)
                .HasColumnType("varchar(255)")
                .HasColumnName("title")
                .IsRequired();

            builder.Property(ul => ul.Url)
                .HasColumnType("varchar(500)")
                .HasColumnName("url")
                .IsRequired();

            builder.Property(ul => ul.CreatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("created_at")
                .IsRequired();

            builder.Property(ul => ul.CreatedBy)
                .HasConversion(x => x.Value, x => new UserId(x))
                .HasColumnName("created_by")
                .IsRequired();

            builder.Property(ul => ul.LastUpdatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasColumnName("last_updated_at");

            builder.Property(ul => ul.LastUpdatedBy)
                .HasConversion(x => x.Value, x => new UserId(x))
                .HasColumnName("last_updated_by");

            builder.HasIndex(ul => ul.ComponentId)
                .HasDatabaseName("ix_component_useful_links_component_id");
        }
    }
}
