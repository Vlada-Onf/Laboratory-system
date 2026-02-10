using Domain.Components;

namespace Api.Dtos
{
    public record ComponentDto(
        Guid Id,
        Guid CategoryId,
        string Name,
        string? Description,
        int Quantity,
        decimal Price,
        string PhotoUrl,
        string SupplierLink,
        string? DocumentationLink,
        DateTime CreatedAt,
        DateTime? LastUpdatedAt)
    {
        public static ComponentDto FromDomainModel(Component component)
            => new(
                component.Id.Value,
                component.CategoryId.Value,
                component.Name,
                component.Description,
                component.Quantity,
                component.Price,
                component.PhotoUrl,
                component.SupplierLink,
                component.DocumentationLink,
                component.CreatedAt,
                component.LastUpdatedAt);
    }

    public record CreateComponentDto(
        Guid CategoryId,
        string Name,
        string? Description,
        int Quantity,
        decimal Price,
        string PhotoUrl,
        string SupplierLink,
        string? DocumentationLink,
        List<Guid> TagIds,
        Guid CreatedBy);

    public record UpdateComponentDto(
        Guid Id,
        Guid CategoryId,
        string Name,
        string? Description,
        int Quantity,
        decimal Price,
        string PhotoUrl,
        string SupplierLink,
        string? DocumentationLink,
        List<Guid> TagIds,
        Guid UpdatedBy);
}
