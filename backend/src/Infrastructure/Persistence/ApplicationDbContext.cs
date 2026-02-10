using Application.Common.Interfaces;
using Domain.Categories;
using Domain.Components;
using Domain.Components.Comment;
using Domain.Components.UsefulLink;
using Domain.DamagedComponents.Reason;
using Domain.DashboardStatistics;
using Domain.History;
using Domain.History.EntityTypes;
using Domain.Needs;
using Domain.Needs.Importance;
using Domain.Needs.Status;
using Domain.Roles;
using Domain.Schematics;
using Domain.Tags;
using Domain.Users;
using Domain.Wishlists;
using Domain.Wishlists.Importance;
using Domain.Wishlists.Status;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : DbContext(options), IApplicationDbContext
    {
        public DbSet<Component> Components { get; init; }
        public DbSet<Category> Categories { get; init; }
        public DbSet<Tag> Tags { get; init; }
        public DbSet<ComponentComment> ComponentComments { get; init; }
        public DbSet<ComponentUsefulLink> ComponentUsefulLinks { get; init; }
        public DbSet<DamagedComponent> DamagedComponents { get; init; }
        public DbSet<DamagedComponentReason> DamagedComponentReasons { get; init; }
        public DbSet<DashboardStatistic> DashboardStatistics { get; init; }
        public DbSet<Action> Actions { get; init; }
        public DbSet<EntityType> EntityTypes { get; init; }
        public DbSet<History> History { get; init; }
        public DbSet<Need> Needs { get; init; }
        public DbSet<NeedStatus> NeedStatuses { get; init; }
        public DbSet<NeedImportance> NeedImportances { get; init; }
        public DbSet<User> Users { get; init; }
        public DbSet<Role> Roles { get; init; }
        public DbSet<Schematic> Schematics { get; init; }
        public DbSet<Wishlist> Wishlists { get; init; }
        public DbSet<WishlistImportance> WishlistImportances { get; init; }
        public DbSet<WishlistStatus> WishlistStatuses { get; init; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(modelBuilder);
        }

        public async Task<IDbTransaction> BeginTransactionAsync(CancellationToken cancellationToken)
        {
            var transaction = await Database.BeginTransactionAsync(cancellationToken);
            return transaction.GetDbTransaction();
        }
    }
}
