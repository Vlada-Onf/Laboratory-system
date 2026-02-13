using Domain.Components.UsefulLink;

namespace Api.Dtos
{
    public record ComponentUsefulLinkDto(
        Guid Id,
        Guid ComponentId,
        string Title,
        string Url,
        Guid CreatedBy,
        DateTime CreatedAt,
        Guid? LastUpdatedBy,
        DateTime? LastUpdatedAt)
    {
        public static ComponentUsefulLinkDto FromDomainModel(ComponentUsefulLink link)
            => new(
                link.Id.Value,
                link.ComponentId.Value,
                link.Title,
                link.Url,
                link.CreatedBy.Value,
                link.CreatedAt,
                link.LastUpdatedBy?.Value,
                link.LastUpdatedAt);
    }

    public record CreateComponentUsefulLinkDto
    {
        public required Guid ComponentId { get; init; }
        public required string Title { get; init; }
        public required string Url { get; init; }
        public required Guid CreatedBy { get; init; }
    }

    public record UpdateComponentUsefulLinkDto
    {
        public required Guid Id { get; init; }
        public required string Title { get; init; }
        public required string Url { get; init; }
        public required Guid UpdatedBy { get; init; }
    }
}
