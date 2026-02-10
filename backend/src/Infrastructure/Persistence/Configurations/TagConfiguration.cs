using Domain.Tags;
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
    public class TagConfiguration : IEntityTypeConfiguration<Tag>
    {
        public void Configure(EntityTypeBuilder<Tag> builder)
        {
            builder.ToTable("tags");

            builder.HasKey(t => t.Id);

            builder.Property(t => t.Id)
                .HasConversion(x => x.Value, x => new TagId(x))
                .HasColumnName("id");

            builder.Property(t => t.Name)
                .HasColumnType("varchar(100)")
                .HasColumnName("name")
                .IsRequired();

            builder.Property(t => t.Color)
                .HasColumnType("varchar(7)")
                .HasColumnName("color")
                .IsRequired();

            builder.Property(t => t.CreatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("created_at")
                .IsRequired();

            builder.HasIndex(t => t.Name)
                .IsUnique()
                .HasDatabaseName("ix_tags_name_unique");
        }
    }
}
