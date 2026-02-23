using Application.WishlistsImportance.Exceptions;
using Domain.Wishlists.Importance;
using LanguageExt;
using MediatR;

namespace Application.WishlistsImportance.Commands.Create
{
    public sealed record CreateWishlistImportanceCommand
        : IRequest<Either<WishlistImportanceException, WishlistImportance>>
    {
        public required string Name { get; init; }
        public required int Level { get; init; }
        public required Guid PerformedBy { get; init; }
    }
}
