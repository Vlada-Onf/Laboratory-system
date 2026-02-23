using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.WishlistsImportance.Exceptions;
using Domain.Wishlists.Importance;
using LanguageExt;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Application.WishlistsImportance.Commands.Delete
{
    public sealed class DeleteWishlistImportanceCommandHandler(
        IWishlistImportanceRepository importanceRepository,
        IHistoryObserver historyObserver,
        ILogger<DeleteWishlistImportanceCommandHandler> logger)
        : IRequestHandler<DeleteWishlistImportanceCommand, Either<WishlistImportanceException, WishlistImportance>>
    {
        public async Task<Either<WishlistImportanceException, WishlistImportance>> Handle(
            DeleteWishlistImportanceCommand request,
            CancellationToken cancellationToken)
        {
            var id = new WishlistImportanceId(request.Id);
            var option = await importanceRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: importance => DeleteEntity(importance, request.PerformedBy, cancellationToken),
                None: () =>
                {
                    logger.LogWarning("WishlistImportance not found for Id={Id}", id.Value);
                    return Task.FromResult<Either<WishlistImportanceException, WishlistImportance>>(
                        new WishlistImportanceNotFoundException(id));
                });
        }

        private async Task<Either<WishlistImportanceException, WishlistImportance>> DeleteEntity(
            WishlistImportance importance,
            Guid performedBy,
            CancellationToken cancellationToken)
        {
            try
            {
                var oldValues = JsonSerializer.Serialize(new
                {
                    importance.Id,
                    importance.Name,
                    importance.Level,
                    importance.CreatedAt
                });

                var deleted = await importanceRepository.DeleteAsync(importance, cancellationToken);

                await historyObserver.EntityDeletedAsync(
                    userId: performedBy,
                    entityTypeName: "WishlistImportance",
                    entityId: importance.Id.Value.ToString(),
                    oldValues: oldValues,
                    cancellationToken: cancellationToken);

                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledWishlistImportanceException(importance.Id, ex);
            }
        }
    }
}
