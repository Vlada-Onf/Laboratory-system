namespace Api.Dtos;

public record ComponentForecastDto(
    Guid ComponentId,
    string Name,
    int CurrentQuantity,
    double AverageDailyUsage,
    int EstimatedDaysLeft,
    string RiskLevel);