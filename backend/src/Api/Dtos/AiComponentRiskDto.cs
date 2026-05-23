namespace Api.Dtos;

public record AiComponentRiskDto(
    Guid ComponentId,
    string Name,
    int CurrentQuantity,
    string RiskLevel,
    int EstimatedDaysLeft,
    string Reason,
    string RecommendedAction);