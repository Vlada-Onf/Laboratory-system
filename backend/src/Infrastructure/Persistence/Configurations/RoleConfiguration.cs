using Domain.Roles;
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
    public class RoleConfiguration : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {
            builder.ToTable("roles");

            builder.HasKey(r => r.Id);

            builder.Property(r => r.Id)
                .HasConversion(x => x.Value, x => new RoleId(x))
                .HasColumnName("id");

            builder.Property(r => r.Name)
                .HasColumnType("varchar(100)")
                .HasColumnName("name")
                .IsRequired();

            builder.Property(r => r.CreatedAt)
                .HasConversion(new DateTimeUtcConverter())
                .HasDefaultValueSql("timezone('utc', now())")
                .HasColumnName("created_at")
                .IsRequired();

            builder.HasIndex(r => r.Name)
                .IsUnique()
                .HasDatabaseName("ix_roles_name_unique");
        }
    }
}
