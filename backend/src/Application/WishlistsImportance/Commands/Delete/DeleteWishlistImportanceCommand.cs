using Application.WishlistsImportance.Exceptions;
using Domain.Wishlists.Importance;
using LanguageExt;
using MediatR;

namespace Application.WishlistsImportance.Commands.Delete
{
    public sealed record DeleteWishlistImportanceCommand(Guid Id, Guid PerformedBy)
        : IRequest<Either<WishlistImportanceException, WishlistImportance>>;
}
