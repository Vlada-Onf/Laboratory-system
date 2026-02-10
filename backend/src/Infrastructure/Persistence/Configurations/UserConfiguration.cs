using Domain.Roles;
using Domain.Users;
using Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("users");

            builder.HasKey(u => u.Id);

            builder.Property(u => u.Id)
                .HasConversion(x => x.Value, x => new UserId(x))
                .HasColumnName("id");

            builder.Property(u => u.ClerkId)
                .HasColumnType("varchar(255)")
                .HasColumnName("clerk_id")
                .IsRequired();

            builder.Property(u => u.Email)
                .HasColumnType("varchar(255)")
                .HasColumnName("email")
                .IsRequired();

            builder.Property(u => u.FirstName)
                .HasColumnType("varchar(100)")
                .HasColumnName("first_name")
                .IsRequired();

            builder.Property(u => u.LastName)
                .HasColumnType("varchar(100)")
                .HasColumnName("last_name")
                .IsRequired();

            builder.Property(u => u.RoleId)
                .HasConversion(x => x.Value, x => new RoleId(x))
                .HasColumnName("role_id")
                .IsRequired();

            builder.Property(u => u.IsActive)
                .HasColumnName("is_active")
                .IsRequired();

            builder.Property(u => u.PhotoUrl)
                .HasColumnType("varchar(500)")
                .HasColumnName("photo_url");

            builder.Property(u => u.CreatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("created_at")
                .IsRequired();

            builder.Property(u => u.UpdatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasColumnName("updated_at");

            builder.Property(u => u.LastActivityAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasColumnName("last_activity_at");

            builder.HasOne(u => u.Role)
                .WithMany()
                .HasForeignKey(u => u.RoleId)
                .HasConstraintName("fk_users_roles_id")
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(u => u.Email)
                .IsUnique()
                .HasDatabaseName("ix_users_email_unique");

            builder.HasIndex(u => u.ClerkId)
                .IsUnique()
                .HasDatabaseName("ix_users_clerk_id_unique");
        }
    }
}
