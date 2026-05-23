using Infrastructure.Persistence;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Application.Common.Interfaces;
using Application.Components.Autofill;
using Infrastructure.AI;
using Application.Components.Forecast;

namespace Infrastructure
{
    public static class ConfigureInfrastructureServices
    {
        public static void AddInfrastructureServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddPersistenceServices(configuration);
            services.Configure<GroqOptions>(
                configuration.GetSection(GroqOptions.SectionName));
            services.AddHttpClient<IGroqService, GroqService>();
            services.AddScoped<IComponentForecastService, ComponentForecastService>();
            services.AddScoped<IAiComponentRiskAnalysisService, AiComponentRiskAnalysisService>();
            services.AddScoped<IComponentAutofillService, ComponentAutofillService>();
        }
    }
}