using Domain.Schematics;

namespace Api.Dtos
{
    public record SchematicDto(
        Guid Id,
        Guid ComponentId,
        string Title,
        string? Description,
        string? PhotoUrl,
        string? DocumentUrl,
        Guid? UsefulLinkId,
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
                schematic.DocumentUrl,
                schematic.SchematicUsefulLinkId?.Value,
                schematic.CreatedBy.Value,
                schematic.CreatedAt,
                schematic.UpdatedBy?.Value,
                schematic.UpdatedAt);
    }

    public class CreateSchematicDto
    {
        public Guid ComponentId { get; set; }
        public string Title { get; set; } = "";
        public string? Description { get; set; }

        public Guid? UsefulLinkId { get; set; }
        public Guid CreatedBy { get; set; }
    }

    public class UpdateSchematicDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = "";
        public string? Description { get; set; }
        public Guid? UsefulLinkId { get; set; }
        public Guid UpdatedBy { get; set; }
    }
}
