using Domain.History.Actions;
using Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class ActionConfiguration : IEntityTypeConfiguration<Action>
    {
        public void Configure(EntityTypeBuilder<Action> builder)
        {
            builder.ToTable("actions");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.Id)
                .HasConversion(x => x.Value, x => new ActionId(x))
                .HasColumnName("id");

            builder.Property(a => a.Name)
                .HasColumnType("varchar(255)")
                .HasColumnName("name")
                .IsRequired();

            builder.Property(a => a.Description)
                .HasColumnType("varchar(2000)")
                .HasColumnName("description");

            builder.Property(a => a.CreatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("created_at")
                .IsRequired();

            builder.HasIndex(a => a.Name)
                .IsUnique()
                .HasDatabaseName("ix_actions_name_unique");
        }
    }
}
