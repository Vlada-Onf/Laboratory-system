using Domain.History;
using Domain.History.Actions;
using Domain.History.EntityTypes;
using Domain.Users;
using Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class HistoryConfiguration : IEntityTypeConfiguration<History>
    {
        public void Configure(EntityTypeBuilder<History> builder)
        {
            builder.ToTable("history");

            builder.HasKey(h => h.Id);

            builder.Property(h => h.Id)
                .HasConversion(x => x.Value, x => new HistoryId(x))
                .HasColumnName("id");

            builder.Property(h => h.UserId)
                .HasConversion(x => x.Value, x => new UserId(x))
                .HasColumnName("user_id")
                .IsRequired();

            builder.Property(h => h.ActionId)
                .HasConversion(x => x.Value, x => new ActionId(x))
                .HasColumnName("action_id")
                .IsRequired();

            builder.Property(h => h.EntityTypeId)
                .HasConversion(x => x.Value, x => new EntityTypeId(x))
                .HasColumnName("entity_type_id")
                .IsRequired();

            builder.Property(h => h.EntityId)
                .HasColumnType("varchar(100)")
                .HasColumnName("entity_id")
                .IsRequired();

            builder.Property(h => h.OldValues)
                .HasColumnType("jsonb")
                .HasColumnName("old_values");

            builder.Property(h => h.NewValues)
                .HasColumnType("jsonb")
                .HasColumnName("new_values");

            builder.Property(h => h.Time)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("time")
                .IsRequired();

            builder.HasOne<Action>()
                .WithMany()
                .HasForeignKey(h => h.ActionId)
                .HasConstraintName("fk_history_actions_id")
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne<EntityType>()
                .WithMany()
                .HasForeignKey(h => h.EntityTypeId)
                .HasConstraintName("fk_history_entity_types_id")
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne<User>()
                .WithMany()
                .HasForeignKey(h => h.UserId)
                .HasConstraintName("fk_history_users_id")
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(h => h.UserId)
                .HasDatabaseName("ix_history_user_id");

            builder.HasIndex(h => h.Time)
                .HasDatabaseName("ix_history_time");
        }
    }
}
