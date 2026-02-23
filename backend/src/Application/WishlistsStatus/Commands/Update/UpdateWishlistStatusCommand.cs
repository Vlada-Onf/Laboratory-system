using Application.WishlistsStatus.Exceptions;
using Domain.Wishlists.Status;
using LanguageExt;
using MediatR;

namespace Application.WishlistsStatus.Commands.Update
{
    public sealed record UpdateWishlistStatusCommand
        : IRequest<Either<WishlistStatusException, WishlistStatus>>
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public string? Description { get; init; }
        public required Guid PerformedBy { get; init; }
    }
}
