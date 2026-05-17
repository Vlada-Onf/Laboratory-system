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
            DateTime? LastUpdatedAt,
            IReadOnlyList<TagDto> Tags)
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
                component.LastUpdatedAt,
                component.Tags.Select(TagDto.FromDomainModel).ToList());
    }
    public class CreateComponentDto
    {
        public Guid CategoryId { get; set; }
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string SupplierLink { get; set; } = "";
        public string? DocumentationLink { get; set; }
        public List<Guid> TagIds { get; set; } = new();
        public Guid CreatedBy { get; set; }
        // public Guid PerformedBy { get; set; }
    }

    public class UpdateComponentDto
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string SupplierLink { get; set; } = "";
        public string? DocumentationLink { get; set; }
        public List<Guid> TagIds { get; set; } = new();
        public Guid LastUpdatedBy { get; set; }
    }
    public record ComponentImportResultDto(Guid Id, string Name);
}
