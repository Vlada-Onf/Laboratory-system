using Domain.Wishlists.Importance;

namespace Api.Dtos
{
    public record WishlistImportanceDto(
        Guid Id,
        string Name,
        int Level,
        DateTime CreatedAt)
    {
        public static WishlistImportanceDto FromDomainModel(WishlistImportance importance)
            => new(
                importance.Id.Value,
                importance.Name,
                importance.Level,
                importance.CreatedAt);
    }

    public record CreateWishlistImportanceDto
    {
        public required string Name { get; init; }
        public required int Level { get; init; }
        public required Guid PerformedBy { get; init; }
    }

    public record UpdateWishlistImportanceDto
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public required int Level { get; init; }
        public required Guid PerformedBy { get; init; }
    }
}
