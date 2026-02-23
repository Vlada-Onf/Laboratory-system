using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.Wishlists.Exceptions;
using Domain.Wishlists;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Wishlists.Commands.Delete
{
    public sealed class DeleteWishlistCommandHandler(
        IWishlistRepository wishlistRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<DeleteWishlistCommand, Either<WishlistException, Wishlist>>
    {
        public async Task<Either<WishlistException, Wishlist>> Handle(
            DeleteWishlistCommand request,
            CancellationToken cancellationToken)
        {
            var id = new WishlistId(request.Id);
            var option = await wishlistRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: w => DeleteEntity(w, request.PerformedBy, cancellationToken),
                None: () => Task.FromResult<Either<WishlistException, Wishlist>>(
                    new WishlistNotFoundException(id)));
        }

        private async Task<Either<WishlistException, Wishlist>> DeleteEntity(
            Wishlist wishlist,
            Guid performedBy,
            CancellationToken cancellationToken)
        {
            try
            {
                var oldValues = JsonSerializer.Serialize(new
                {
                    wishlist.Id,
                    wishlist.Name,
                    wishlist.Description,
                    wishlist.QuantityNeeded,
                    wishlist.RequestedBy,
                    wishlist.RequestedAt,
                    wishlist.ImportanceId,
                    wishlist.StatusId,
                    wishlist.CompletedAt,
                    wishlist.CompletionReason
                });

                var deleted = await wishlistRepository.DeleteAsync(wishlist, cancellationToken);

                await historyObserver.EntityDeletedAsync(
                    userId: performedBy,
                    entityTypeName: "Wishlist",
                    entityId: wishlist.Id.Value.ToString(),
                    oldValues: oldValues,
                    cancellationToken: cancellationToken);

                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledWishlistException(wishlist.Id, ex);
            }
        }
    }
}
