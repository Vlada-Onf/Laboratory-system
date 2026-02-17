using Domain.Wishlists;

namespace Api.Dtos
{
    public record WishlistDto(
        Guid Id,
        string Name,
        string? Description,
        int QuantityNeeded,
        Guid RequestedBy,
        DateTime RequestedAt,
        Guid ImportanceId,
        Guid StatusId,
        DateTime? CompletedAt,
        string? CompletionReason)
    {
        public static WishlistDto FromDomainModel(Wishlist wishlist)
            => new(
                wishlist.Id.Value,
                wishlist.Name,
                wishlist.Description,
                wishlist.QuantityNeeded,
                wishlist.RequestedBy.Value,
                wishlist.RequestedAt,
                wishlist.ImportanceId.Value,
                wishlist.StatusId.Value,
                wishlist.CompletedAt,
                wishlist.CompletionReason);
    }

    public record CreateWishlistDto
    {
        public required string Name { get; init; }
        public string? Description { get; init; }
        public required int QuantityNeeded { get; init; }
        public required Guid RequestedBy { get; init; }
        public required Guid ImportanceId { get; init; }
        public required Guid StatusId { get; init; }
    }

    public record UpdateWishlistDetailsDto
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public string? Description { get; init; }
        public required int QuantityNeeded { get; init; }
        public required Guid ImportanceId { get; init; }
    }
}
