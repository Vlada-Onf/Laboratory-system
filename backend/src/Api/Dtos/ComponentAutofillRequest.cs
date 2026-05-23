namespace Api.Dtos;

public class ComponentAutofillRequest
{
    public string Name { get; set; } = string.Empty;
    public string? SupplierLink { get; set; }
    public string? ExistingDescription { get; set; }
}