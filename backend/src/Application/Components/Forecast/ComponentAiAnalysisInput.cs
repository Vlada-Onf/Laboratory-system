namespace Application.Components.Forecast;

public record ComponentAiAnalysisInput(
    Guid ComponentId,
    string Name,
    int CurrentQuantity,
    double AverageDailyUsage,
    int EstimatedDaysLeft,
    int ConsumptionEventsCount,
    int DaysSinceLastConsumption);