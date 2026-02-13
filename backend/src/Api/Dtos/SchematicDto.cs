using Domain.Schematics;

namespace Api.Dtos
{
    public record SchematicDto(
        Guid Id,
        Guid ComponentId,
        string Title,
        string? Description,
        string? PhotoUrl,
        string? AdditionalLinks,
        Guid CreatedBy,
        DateTime CreatedAt,
        Guid? UpdatedBy,
        DateTime? UpdatedAt)
    {
        public static SchematicDto FromDomainModel(Schematic schematic)
            => new(
                schematic.Id.Value,
                schematic.ComponentId.Value,
                schematic.Title,
                schematic.Description,
                schematic.PhotoUrl,
                schematic.AdditionalLinks,
                schematic.CreatedBy.Value,
                schematic.CreatedAt,
                schematic.UpdatedBy?.Value,
                schematic.UpdatedAt);
    }

    public record CreateSchematicDto
    {
        public required Guid ComponentId { get; init; }
        public required string Title { get; init; }
        public string? Description { get; init; }
        public string? PhotoUrl { get; init; }
        public string? AdditionalLinks { get; init; }
        public required Guid CreatedBy { get; init; }
    }

    public record UpdateSchematicDto
    {
        public required Guid Id { get; init; }
        public required string Title { get; init; }
        public string? Description { get; init; }
        public string? PhotoUrl { get; init; }
        public string? AdditionalLinks { get; init; }
        public required Guid UpdatedBy { get; init; }
    }
}
