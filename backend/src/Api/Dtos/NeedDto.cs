using Domain.Needs;

namespace Api.Dtos
{
    public record NeedDto(
            Guid Id,
            Guid ComponentId,
            Guid StatusId,
            int QuantityNeeded,
            Guid RequestedBy,
            DateTime RequestedAt,
            string? Description,
            DateTime? CompletedAt,
            string? CompletionReason,
            Guid ImportanceId)
    {
        public static NeedDto FromDomainModel(Need need)
            => new(
                need.Id.Value,
                need.ComponentId.Value,
                need.StatusId.Value,
                need.QuantityNeeded,
                need.RequestedBy.Value,
                need.RequestedAt,
                need.Description,
                need.CompletedAt,
                need.CompletionReason,
                need.ImportanceId.Value);
    }

    public record CreateNeedDto
    {
        public required Guid ComponentId { get; init; }
        public required int QuantityNeeded { get; init; }
        public required Guid RequestedBy { get; init; }
        public string? Description { get; init; }

        public required Guid StatusId { get; init; }
        public required Guid ImportanceId { get; init; }
        public string? CompletionReason { get; init; }

        public required Guid PerformedBy { get; init; }
    }

    public record UpdateNeedDetailsDto
    {
        public required Guid Id { get; init; }
        public required int QuantityNeeded { get; init; }
        public string? Description { get; init; }
        public required Guid ImportanceId { get; init; }
        public string? CompletionReason { get; init; }
        public required Guid StatusId { get; init; }
        public required Guid PerformedBy { get; init; }
    }
    public record UpdateNeedImportanceDto
    {
        public required Guid Id { get; init; }
        public required Guid ImportanceId { get; init; }
        public required Guid PerformedBy { get; init; }
    }
}
