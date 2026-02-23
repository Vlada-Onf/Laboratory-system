using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.WishlistsStatus.Exceptions;
using Domain.Wishlists.Status;
using LanguageExt;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Application.WishlistsStatus.Commands.Delete
{
    public sealed class DeleteWishlistStatusCommandHandler(
        IWishlistStatusRepository statusRepository,
        IHistoryObserver historyObserver,
        ILogger<DeleteWishlistStatusCommandHandler> logger)
        : IRequestHandler<DeleteWishlistStatusCommand, Either<WishlistStatusException, WishlistStatus>>
    {
        public async Task<Either<WishlistStatusException, WishlistStatus>> Handle(
            DeleteWishlistStatusCommand request,
            CancellationToken cancellationToken)
        {
            logger.LogInformation("DeleteWishlistStatus started for Id={Id}", request.Id);

            var id = new WishlistStatusId(request.Id);
            var option = await statusRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: status => DeleteEntity(status, request.PerformedBy, cancellationToken),
                None: () =>
                {
                    logger.LogWarning("WishlistStatus not found for Id={Id}", id.Value);
                    return Task.FromResult<Either<WishlistStatusException, WishlistStatus>>(
                        new WishlistStatusNotFoundException(id));
                });
        }

        private async Task<Either<WishlistStatusException, WishlistStatus>> DeleteEntity(
            WishlistStatus status,
            Guid performedBy,
            CancellationToken cancellationToken)
        {
            try
            {
                logger.LogInformation("Deleting WishlistStatus Id={Id}, Name={Name}",
                    status.Id.Value, status.Name);

                var oldValues = JsonSerializer.Serialize(new
                {
                    status.Id,
                    status.Name,
                    status.Description,
                    status.CreatedAt
                });

                var deleted = await statusRepository.DeleteAsync(status, cancellationToken);

                await historyObserver.EntityDeletedAsync(
                    userId: performedBy,
                    entityTypeName: "WishlistStatus",
                    entityId: status.Id.Value.ToString(),
                    oldValues: oldValues,
                    cancellationToken: cancellationToken);

                logger.LogInformation("WishlistStatus deleted successfully Id={Id}",
                    deleted.Id.Value);

                return deleted;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error while deleting WishlistStatus Id={Id}", status.Id.Value);
                return new UnhandledWishlistStatusException(status.Id, ex);
            }
        }
    }
}
