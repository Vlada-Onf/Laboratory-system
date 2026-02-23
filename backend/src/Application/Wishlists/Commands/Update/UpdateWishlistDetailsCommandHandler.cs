using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.Wishlists.Exceptions;
using Domain.Wishlists;
using Domain.Wishlists.Importance;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Wishlists.Commands.Update
{
    public sealed class UpdateWishlistDetailsCommandHandler(
        IWishlistRepository wishlistRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<UpdateWishlistDetailsCommand, Either<WishlistException, Wishlist>>
    {
        public async Task<Either<WishlistException, Wishlist>> Handle(
            UpdateWishlistDetailsCommand request,
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
            UpdateWishlistDetailsCommand request,
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
                    wishlist.ImportanceId
                });

                var importanceId = new WishlistImportanceId(request.ImportanceId);

                wishlist.UpdateDetails(
                    name: request.Name,
                    description: request.Description,
                    quantityNeeded: request.QuantityNeeded,
                    importanceId: importanceId);

                var updated = await wishlistRepository.UpdateAsync(wishlist, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    wishlist.Id,
                    wishlist.Name,
                    wishlist.Description,
                    wishlist.QuantityNeeded,
                    wishlist.ImportanceId
                });

                await historyObserver.EntityUpdatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "Wishlist",
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
