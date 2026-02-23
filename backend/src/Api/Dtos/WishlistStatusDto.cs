using Domain.Wishlists.Status;

namespace Api.Dtos
{
    public record WishlistStatusDto(
        Guid Id,
        string Name,
        string? Description,
        DateTime CreatedAt)
    {
        public static WishlistStatusDto FromDomainModel(WishlistStatus status)
            => new(
                status.Id.Value,
                status.Name,
                status.Description,
                status.CreatedAt);
    }

    public record CreateWishlistStatusDto
    {
        public required string Name { get; init; }
        public string? Description { get; init; }
        public required Guid PerformedBy { get; init; }
    }

    public record UpdateWishlistStatusDto
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public string? Description { get; init; }
        public required Guid PerformedBy { get; init; }
    }

    public record ChangeWishlistStatusDto
    {
        public required Guid Id { get; init; }
        public required Guid StatusId { get; init; }
        public string? CompletionReason { get; init; }
    }
}
