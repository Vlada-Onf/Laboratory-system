using Application.Common.Interfaces;
using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.HistoryEntries.Observers;
using Infrastructure.Files;
using Infrastructure.HistoryOfAction;
using Infrastructure.Persistence.Repositories;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Npgsql;
using Infrastructure.Excel;

namespace Infrastructure.Persistence
{
    public static class ConfigurePersistenceServices
    {
        public static void AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
        {
            // 1. Беремо connection string: спочатку з env, потім з appsettings
            var connectionString =
                Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ??
                configuration.GetConnectionString("DefaultConnection");

            if (string.IsNullOrWhiteSpace(connectionString))
                throw new InvalidOperationException("Connection string is null or empty");

            // 2. Будуємо NpgsqlDataSource
            var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
            dataSourceBuilder.EnableDynamicJson();
            var dataSource = dataSourceBuilder.Build();

            // 3. Реєструємо DbContext + докручуємо логування помилок
            services.AddDbContext<ApplicationDbContext>(options => options
                .UseNpgsql(
                    dataSource,
                    builder => builder.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName))
                .UseSnakeCaseNamingConvention()
                .LogTo(Console.WriteLine, LogLevel.Error)
                .EnableSensitiveDataLogging()
                .ConfigureWarnings(w =>
                {
                    w.Ignore(CoreEventId.ManyServiceProvidersCreatedWarning);
                }));

            // 4. Initialiser + IApplicationDbContext
            services.AddScoped<ApplicationDbContextInitialiser>();
            services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

            // 5. Репозиторії
            services.AddRepositories();
        }

        private static void AddRepositories(this IServiceCollection services)
        {
            // Components
            services.AddScoped<ComponentRepository>();
            services.AddScoped<IComponentRepository>(provider => provider.GetRequiredService<ComponentRepository>());
            services.AddScoped<IComponentQueries>(provider => provider.GetRequiredService<ComponentRepository>());

            // Categories
            services.AddScoped<CategoryRepository>();
            services.AddScoped<ICategoryRepository>(provider => provider.GetRequiredService<CategoryRepository>());
            services.AddScoped<ICategoryQueries>(provider => provider.GetRequiredService<CategoryRepository>());

            // Tags
            services.AddScoped<TagRepository>();
            services.AddScoped<ITagRepository>(p => p.GetRequiredService<TagRepository>());
            services.AddScoped<ITagQueries>(p => p.GetRequiredService<TagRepository>());

            // Component useful links
            services.AddScoped<ComponentUsefulLinkRepository>();
            services.AddScoped<IComponentUsefulLinkRepository>(p => p.GetRequiredService<ComponentUsefulLinkRepository>());
            services.AddScoped<IComponentUsefulLinkQueries>(p => p.GetRequiredService<ComponentUsefulLinkRepository>());

            // Component comments
            services.AddScoped<ComponentCommentRepository>();
            services.AddScoped<IComponentCommentRepository>(p => p.GetRequiredService<ComponentCommentRepository>());
            services.AddScoped<IComponentCommentQueries>(p => p.GetRequiredService<ComponentCommentRepository>());

            // Damaged Components
            services.AddScoped<DamagedComponentRepository>();
            services.AddScoped<IDamagedComponentRepository>(provider => provider.GetRequiredService<DamagedComponentRepository>());
            services.AddScoped<IDamagedComponentQueries>(provider => provider.GetRequiredService<DamagedComponentRepository>());

            // Damaged Component Reasons
            services.AddScoped<DamagedComponentReasonRepository>();
            services.AddScoped<IDamagedComponentReasonRepository>(provider => provider.GetRequiredService<DamagedComponentReasonRepository>());
            services.AddScoped<IDamagedComponentReasonQueries>(provider => provider.GetRequiredService<DamagedComponentReasonRepository>());

            // Dashboard Statistics
            services.AddScoped<DashboardStatisticRepository>();
            services.AddScoped<IDashboardStatisticRepository>(provider => provider.GetRequiredService<DashboardStatisticRepository>());
            services.AddScoped<IDashboardStatisticQueries>(provider => provider.GetRequiredService<DashboardStatisticRepository>());

            // History
            services.AddScoped<HistoryRepository>();
            services.AddScoped<IHistoryRepository>(p => p.GetRequiredService<HistoryRepository>());
            services.AddScoped<IHistoryQueries>(p => p.GetRequiredService<HistoryRepository>());

            // Actions
            services.AddScoped<ActionRepository>();
            services.AddScoped<IActionRepository>(p => p.GetRequiredService<ActionRepository>());

            // EntityTypes
            services.AddScoped<EntityTypeRepository>();
            services.AddScoped<IEntityTypeRepository>(p => p.GetRequiredService<EntityTypeRepository>());

            // Needs
            services.AddScoped<NeedRepository>();
            services.AddScoped<INeedRepository>(p => p.GetRequiredService<NeedRepository>());
            services.AddScoped<INeedQueries>(p => p.GetRequiredService<NeedRepository>());

            services.AddScoped<NeedStatusRepository>();
            services.AddScoped<INeedStatusRepository>(p => p.GetRequiredService<NeedStatusRepository>());

            services.AddScoped<NeedImportanceRepository>();
            services.AddScoped<INeedImportanceRepository>(p => p.GetRequiredService<NeedImportanceRepository>());

            // Users
            services.AddScoped<UserRepository>();
            services.AddScoped<IUserRepository>(p => p.GetRequiredService<UserRepository>());
            services.AddScoped<IUserQueries>(p => p.GetRequiredService<UserRepository>());

            // Roles
            services.AddScoped<RoleRepository>();
            services.AddScoped<IRoleRepository>(p => p.GetRequiredService<RoleRepository>());
            services.AddScoped<IRoleQueries>(p => p.GetRequiredService<RoleRepository>());

            // Schematics
            services.AddScoped<SchematicRepository>();
            services.AddScoped<ISchematicRepository>(p => p.GetRequiredService<SchematicRepository>());
            services.AddScoped<ISchematicQueries>(p => p.GetRequiredService<SchematicRepository>());

            // Schematic useful links
            services.AddScoped<SchematicUsefulLinkRepository>();
            services.AddScoped<ISchematicUsefulLinkRepository>(p => p.GetRequiredService<SchematicUsefulLinkRepository>());
            services.AddScoped<ISchematicUsefulLinkQueries>(p => p.GetRequiredService<SchematicUsefulLinkRepository>());

            //History
            services.AddScoped<IHistoryRepository, HistoryRepository>();
            services.AddScoped<IHistoryQueries, HistoryRepository>();
            services.AddScoped<IHistoryObserver, HistoryObserver>();

            // Wishlists
            services.AddScoped<WishlistRepository>();
            services.AddScoped<IWishlistRepository>(p => p.GetRequiredService<WishlistRepository>());
            services.AddScoped<IWishlistQueries>(p => p.GetRequiredService<WishlistRepository>());

            services.AddScoped<WishlistImportanceRepository>();
            services.AddScoped<IWishlistImportanceRepository>(p => p.GetRequiredService<WishlistImportanceRepository>());

            services.AddScoped<WishlistStatusRepository>();
            services.AddScoped<IWishlistStatusRepository>(p => p.GetRequiredService<WishlistStatusRepository>());

            services.AddScoped<IFileStorageService, AzureBlobStorageService>();
        }
    }
}
