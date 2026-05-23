namespace Application.Components.Autofill;

public record ComponentAutofillInput(
    string Name,
    string? SupplierLink,
    string? ExistingDescription,
    IReadOnlyList<CategoryOption> Categories,
    IReadOnlyList<TagOption> Tags);

public record CategoryOption(
    Guid Id,
    string Name,
    string? Description);

public record TagOption(
    Guid Id,
    string Name);