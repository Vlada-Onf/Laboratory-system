using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.Wishlists.Exceptions;
using Domain.Users;
using Domain.Wishlists;
using Domain.Wishlists.Importance;
using Domain.Wishlists.Status;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Wishlists.Commands.Create
{
    public sealed class CreateWishlistCommandHandler(
        IWishlistRepository wishlistRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<CreateWishlistCommand, Either<WishlistException, Wishlist>>
    {
        public async Task<Either<WishlistException, Wishlist>> Handle(
            CreateWishlistCommand request,
            CancellationToken cancellationToken)
        {
            WishlistId? id = null;

            try
            {
                var requestedBy = new UserId(request.RequestedBy);
                var importanceId = new WishlistImportanceId(request.ImportanceId);
                var statusId = new WishlistStatusId(request.StatusId);

                var wishlist = Wishlist.Create(
                    name: request.Name,
                    description: request.Description,
                    quantityNeeded: request.QuantityNeeded,
                    requestedBy: requestedBy,
                    importanceId: importanceId,
                    statusId: statusId);

                id = wishlist.Id;

                var created = await wishlistRepository.AddAsync(wishlist, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
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

                await historyObserver.EntityCreatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "Wishlist",
                    entityId: wishlist.Id.Value.ToString(),
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledWishlistException(
                    id ?? WishlistId.Empty(),
                    ex);
            }
        }
    }
}
