using Domain.History;

namespace Api.Dtos
{
    public record HistoryEntryDto(
        Guid Id,
        Guid UserId,
        Guid ActionId,
        Guid EntityTypeId,
        string EntityId,
        string? OldValues,
        string? NewValues,
        DateTime Time)
    {
        public static HistoryEntryDto FromDomainModel(History entry)
            => new(
                entry.Id.Value,
                entry.UserId.Value,
                entry.ActionId.Value,
                entry.EntityTypeId.Value,
                entry.EntityId,
                entry.OldValues,
                entry.NewValues,
                entry.Time);
    }

    public record CreateHistoryEntryDto
    {
        public required Guid UserId { get; init; }
        public required Guid ActionId { get; init; }
        public required Guid EntityTypeId { get; init; }
        public required string EntityId { get; init; }
        public string? OldValues { get; init; }
        public string? NewValues { get; init; }
    }
}
