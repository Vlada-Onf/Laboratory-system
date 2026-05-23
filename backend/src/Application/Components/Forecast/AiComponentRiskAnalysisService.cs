using System.Text.Json;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Queries;

namespace Application.Components.Forecast;

public interface IAiComponentRiskAnalysisService
{
    Task<IReadOnlyList<AiComponentRiskResult>> AnalyzeAsync(CancellationToken cancellationToken);
}

public record AiComponentRiskResult(
    Guid ComponentId,
    string Name,
    int CurrentQuantity,
    string RiskLevel,
    int EstimatedDaysLeft,
    string Reason,
    string RecommendedAction);

public class AiComponentRiskAnalysisService : IAiComponentRiskAnalysisService
{
    private readonly IComponentQueries _componentQueries;
    private readonly IHistoryQueries _historyQueries;
    private readonly IGroqService _groqService;

    public AiComponentRiskAnalysisService(
        IComponentQueries componentQueries,
        IHistoryQueries historyQueries,
        IGroqService groqService)
    {
        _componentQueries = componentQueries;
        _historyQueries = historyQueries;
        _groqService = groqService;
    }

    public async Task<IReadOnlyList<AiComponentRiskResult>> AnalyzeAsync(
        CancellationToken cancellationToken)
    {
        var components = await _componentQueries.GetAllAsync(cancellationToken);
        var history = await _historyQueries.GetAllAsync(cancellationToken);

        var analysisInput = new List<ComponentAiAnalysisInput>();

        foreach (var component in components)
        {
            var componentHistory = history
                .Where(h => h.EntityId == component.Id.Value.ToString()
                         && !string.IsNullOrWhiteSpace(h.OldValues)
                         && !string.IsNullOrWhiteSpace(h.NewValues))
                .OrderBy(h => h.Time)
                .ToList();

            if (!componentHistory.Any())
                continue;

            double totalConsumed = 0;
            int consumptionEventsCount = 0;
            DateTime? firstConsumptionDate = null;
            DateTime? lastConsumptionDate = null;

            foreach (var entry in componentHistory)
            {
                var oldQuantity = TryExtractQuantity(entry.OldValues);
                var newQuantity = TryExtractQuantity(entry.NewValues);

                if (oldQuantity is null || newQuantity is null)
                    continue;

                if (newQuantity.Value < oldQuantity.Value)
                {
                    totalConsumed += oldQuantity.Value - newQuantity.Value;
                    consumptionEventsCount++;
                    firstConsumptionDate ??= entry.Time;
                    lastConsumptionDate = entry.Time;
                }
            }

            if (consumptionEventsCount == 0 || firstConsumptionDate is null || lastConsumptionDate is null)
                continue;

            var totalDays = Math.Max(1, (lastConsumptionDate.Value - firstConsumptionDate.Value).TotalDays);
            var averageDailyUsage = totalConsumed / totalDays;

            if (averageDailyUsage <= 0)
                continue;

            var estimatedDaysLeft = (int)Math.Floor(component.Quantity / averageDailyUsage);
            var daysSinceLastConsumption = (int)Math.Floor((DateTime.UtcNow - lastConsumptionDate.Value).TotalDays);

            analysisInput.Add(new ComponentAiAnalysisInput(
                component.Id.Value,
                component.Name,
                component.Quantity,
                Math.Round(averageDailyUsage, 2),
                estimatedDaysLeft,
                consumptionEventsCount,
                daysSinceLastConsumption));
        }

        var jsonInput = JsonSerializer.Serialize(analysisInput, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        var aiJson = await _groqService.AnalyzeLowStockRiskAsync(jsonInput, cancellationToken);

        var parsed = JsonSerializer.Deserialize<List<AiComponentRiskResult>>(
            aiJson,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

        return parsed ?? [];
    }

    private static int? TryExtractQuantity(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return null;

        try
        {
            using var document = JsonDocument.Parse(json);

            if (document.RootElement.TryGetProperty("Quantity", out var quantityElement) &&
                quantityElement.ValueKind == JsonValueKind.Number &&
                quantityElement.TryGetInt32(out var quantity))
            {
                return quantity;
            }

            return null;
        }
        catch
        {
            return null;
        }
    }
}