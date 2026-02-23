using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.WishlistsStatus.Exceptions;
using Domain.Wishlists.Status;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.WishlistsStatus.Commands.Update
{
    public sealed class UpdateWishlistStatusCommandHandler(
        IWishlistStatusRepository statusRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<UpdateWishlistStatusCommand, Either<WishlistStatusException, WishlistStatus>>
    {
        public async Task<Either<WishlistStatusException, WishlistStatus>> Handle(
            UpdateWishlistStatusCommand request,
            CancellationToken cancellationToken)
        {
            var id = new WishlistStatusId(request.Id);
            var option = await statusRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: status => UpdateEntity(status, request, cancellationToken),
                None: () => Task.FromResult<Either<WishlistStatusException, WishlistStatus>>(
                    new WishlistStatusNotFoundException(id)));
        }

        private async Task<Either<WishlistStatusException, WishlistStatus>> UpdateEntity(
            WishlistStatus status,
            UpdateWishlistStatusCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                var oldValues = JsonSerializer.Serialize(new
                {
                    status.Id,
                    status.Name,
                    status.Description,
                    status.CreatedAt
                });

                status.Update(
                    name: request.Name,
                    description: request.Description);

                var updated = await statusRepository.UpdateAsync(status, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    status.Id,
                    status.Name,
                    status.Description,
                    status.CreatedAt
                });

                await historyObserver.EntityUpdatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "WishlistStatus",
                    entityId: status.Id.Value.ToString(),
                    oldValues: oldValues,
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledWishlistStatusException(status.Id, ex);
            }
        }
    }
}
