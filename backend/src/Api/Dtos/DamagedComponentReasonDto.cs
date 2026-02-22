using Domain.DamagedComponents.Reason;

namespace Api.Dtos
{
    public record DamagedComponentReasonDto(
        Guid Id,
        string Name,
        string? Description,
        DateTime CreatedAt)
    {
        public static DamagedComponentReasonDto FromDomainModel(DamagedComponentReason reason)
            => new(
                reason.Id.Value,
                reason.Name,
                reason.Description,
                reason.CreatedAt);
    }

    public record CreateDamagedComponentReasonDto
    {
        public required string Name { get; init; }
        public string? Description { get; init; }
        public Guid PerformedBy { get; init; }
    }

    public record UpdateDamagedComponentReasonDto
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public string? Description { get; init; }
        public Guid PerformedBy { get; init; }
    }
}
