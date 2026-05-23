namespace Application.Components.Autofill;

public record ComponentAutofillResult(
    Guid? SuggestedCategoryId,
    string Description,
    IReadOnlyList<Guid> TagIds,
    double Confidence);