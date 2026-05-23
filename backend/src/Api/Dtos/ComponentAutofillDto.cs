namespace Api.Dtos;

public record ComponentAutofillDto(
    Guid? SuggestedCategoryId,
    string Description,
    List<Guid> TagIds,
    double Confidence);