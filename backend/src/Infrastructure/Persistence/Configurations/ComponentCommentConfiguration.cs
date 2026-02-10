using Domain.Components;
using Domain.Components.Comment;
using Domain.Users;
using Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class ComponentCommentConfiguration : IEntityTypeConfiguration<ComponentComment>
    {
        public void Configure(EntityTypeBuilder<ComponentComment> builder)
        {
            builder.ToTable("component_comments");

            builder.HasKey(cc => cc.Id);

            builder.Property(cc => cc.Id)
                .HasConversion(x => x.Value, x => new ComponentCommentId(x))
                .HasColumnName("id");

            builder.Property(cc => cc.ComponentId)
                .HasConversion(x => x.Value, x => new ComponentId(x))
                .HasColumnName("component_id");

            builder.Property(cc => cc.Content)
                .HasColumnType("varchar(2000)")
                .HasColumnName("content")
                .IsRequired();

            builder.Property(cc => cc.CreatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("created_at")
                .IsRequired();

            builder.Property(cc => cc.CreatedBy)
                .HasConversion(x => x.Value, x => new UserId(x))
                .HasColumnName("created_by")
                .IsRequired();

            builder.Property(cc => cc.LastUpdatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasColumnName("last_updated_at");

            builder.HasIndex(cc => cc.ComponentId)
                .HasDatabaseName("ix_component_comments_component_id");
        }
    }
}
