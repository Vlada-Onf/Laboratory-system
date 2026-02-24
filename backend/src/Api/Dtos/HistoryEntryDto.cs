using Domain.History;
using Domain.Users;

namespace Api.Dtos
{
    public record HistoryEntryDto(
        Guid Id,
        Guid UserId,
        string AuthorEmail,
        string AuthorFirstName,
        string AuthorLastName,
        string? AuthorPhotoUrl,
        Guid ActionId,
        Guid EntityTypeId,
        string EntityId,
        string? OldValues,
        string? NewValues,
        DateTime Time)
    {
        public static HistoryEntryDto FromDomainModel(History entry, User author)
            => new(
                entry.Id.Value,
                entry.UserId.Value,
                author.Email,
                author.FirstName,
                author.LastName,
                author.PhotoUrl,
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
