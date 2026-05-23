using System.Text.Json;
using Application.Common.Interfaces.Queries;

namespace Application.Components.Forecast;

public interface IComponentForecastService
{
    Task<IReadOnlyList<ComponentForecastResult>> GetForecastsAsync(CancellationToken cancellationToken);
}

public record ComponentForecastResult(
    Guid ComponentId,
    string Name,
    int CurrentQuantity,
    double AverageDailyUsage,
    int EstimatedDaysLeft,
    string RiskLevel);

public class ComponentForecastService : IComponentForecastService
{
    private readonly IComponentQueries _componentQueries;
    private readonly IHistoryQueries _historyQueries;

    public ComponentForecastService(
        IComponentQueries componentQueries,
        IHistoryQueries historyQueries)
    {
        _componentQueries = componentQueries;
        _historyQueries = historyQueries;
    }

    public async Task<IReadOnlyList<ComponentForecastResult>> GetForecastsAsync(
        CancellationToken cancellationToken)
    {
        var components = await _componentQueries.GetAllAsync(cancellationToken);
        var history = await _historyQueries.GetAllAsync(cancellationToken);

        var results = new List<ComponentForecastResult>();

        var quantityChangedHistory = history
            .Where(h =>
                !string.IsNullOrWhiteSpace(h.EntityId) &&
                !string.IsNullOrWhiteSpace(h.OldValues) &&
                !string.IsNullOrWhiteSpace(h.NewValues))
            .OrderBy(h => h.Time)
            .ToList();

        foreach (var component in components)
        {
            var componentHistory = quantityChangedHistory
                .Where(h => h.EntityId == component.Id.Value.ToString())
                .ToList();

            if (!componentHistory.Any())
                continue;

            double totalConsumed = 0;
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
                    firstConsumptionDate ??= entry.Time;
                    lastConsumptionDate = entry.Time;
                }
            }

            if (totalConsumed <= 0 || firstConsumptionDate is null || lastConsumptionDate is null)
                continue;

            var totalDays = Math.Max(1, (lastConsumptionDate.Value - firstConsumptionDate.Value).TotalDays);
            var averageDailyUsage = totalConsumed / totalDays;

            if (averageDailyUsage <= 0)
                continue;

            var estimatedDaysLeft = (int)Math.Floor(component.Quantity / averageDailyUsage);

            var riskLevel = estimatedDaysLeft switch
            {
                <= 3 => "high",
                <= 7 => "medium",
                _ => "low"
            };

            results.Add(new ComponentForecastResult(
                component.Id.Value,
                component.Name,
                component.Quantity,
                Math.Round(averageDailyUsage, 2),
                estimatedDaysLeft,
                riskLevel));
        }

        return results
            .OrderBy(r => r.EstimatedDaysLeft)
            .ToList();
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