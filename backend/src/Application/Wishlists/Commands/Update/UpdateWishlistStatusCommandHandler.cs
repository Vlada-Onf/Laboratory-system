using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.Wishlists.Exceptions;
using Domain.Wishlists;
using Domain.Wishlists.Status;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Wishlists.Commands.Update
{
    public sealed class UpdateWishlistStatusCommandHandler(
        IWishlistRepository wishlistRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<UpdateWishlistStatusCommand, Either<WishlistException, Wishlist>>
    {
        public async Task<Either<WishlistException, Wishlist>> Handle(
            UpdateWishlistStatusCommand request,
            CancellationToken cancellationToken)
        {
            var id = new WishlistId(request.Id);
            var option = await wishlistRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: w => UpdateEntity(w, request, cancellationToken),
                None: () => Task.FromResult<Either<WishlistException, Wishlist>>(
                    new WishlistNotFoundException(id)));
        }

        private async Task<Either<WishlistException, Wishlist>> UpdateEntity(
            Wishlist wishlist,
            UpdateWishlistStatusCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                var oldValues = JsonSerializer.Serialize(new
                {
                    wishlist.Id,
                    wishlist.StatusId,
                    wishlist.CompletedAt,
                    wishlist.CompletionReason
                });

                var statusId = new WishlistStatusId(request.StatusId);

                wishlist.UpdateStatus(
                    statusId: statusId,
                    reason: request.CompletionReason);

                var updated = await wishlistRepository.UpdateAsync(wishlist, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    wishlist.Id,
                    wishlist.StatusId,
                    wishlist.CompletedAt,
                    wishlist.CompletionReason
                });

                await historyObserver.EntityUpdatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "WishlistStatusChange",
                    entityId: wishlist.Id.Value.ToString(),
                    oldValues: oldValues,
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledWishlistException(wishlist.Id, ex);
            }
        }
    }
}
