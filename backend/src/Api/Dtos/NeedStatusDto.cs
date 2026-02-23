using Domain.Needs.Status;

namespace Api.Dtos
{
    public record NeedStatusDto(
        Guid Id,
        string Name,
        string? Description,
        DateTime CreatedAt)
    {
        public static NeedStatusDto FromDomainModel(NeedStatus status)
            => new(
                status.Id.Value,
                status.Name,
                status.Description,
                status.CreatedAt);
    }

    public record CreateNeedStatusDto
    {
        public required string Name { get; init; }
        public string? Description { get; init; }
        public required Guid PerformedBy { get; init; }
    }

    public record UpdateNeedStatusDto
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public string? Description { get; init; }
        public required Guid PerformedBy { get; init; }
    }

}
