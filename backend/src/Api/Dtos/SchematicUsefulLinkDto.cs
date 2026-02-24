namespace Api.Dtos
{
    public record SchematicUsefulLinkDto(
        Guid Id,
        Guid SchematicId,
        string Title,
        string Url,
        Guid CreatedBy,
        DateTime CreatedAt,
        Guid? LastUpdatedBy,
        DateTime? LastUpdatedAt)
    {
        public static SchematicUsefulLinkDto FromDomainModel(Domain.Schematics.UsefulLink.SchematicUsefulLink link)
            => new(
                link.Id.Value,
                link.SchematicId.Value,
                link.Title,
                link.Url,
                link.CreatedBy.Value,
                link.CreatedAt,
                link.LastUpdatedBy?.Value,
                link.LastUpdatedAt);
    }

    public class CreateSchematicUsefulLinkDto
    {
        public Guid SchematicId { get; set; }
        public string Title { get; set; } = "";
        public string Url { get; set; } = "";
        public Guid CreatedBy { get; set; }
        public Guid PerformedBy { get; set; }
    }

    public class UpdateSchematicUsefulLinkDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = "";
        public string Url { get; set; } = "";
        public Guid UpdatedBy { get; set; }
        public Guid PerformedBy { get; set; }   // ← додали
    }
}
