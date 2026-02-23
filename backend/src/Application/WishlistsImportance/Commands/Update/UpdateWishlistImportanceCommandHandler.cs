using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.WishlistsImportance.Exceptions;
using Domain.Wishlists.Importance;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.WishlistsImportance.Commands.Update
{
    public sealed class UpdateWishlistImportanceCommandHandler(
        IWishlistImportanceRepository importanceRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<UpdateWishlistImportanceCommand, Either<WishlistImportanceException, WishlistImportance>>
    {
        public async Task<Either<WishlistImportanceException, WishlistImportance>> Handle(
            UpdateWishlistImportanceCommand request,
            CancellationToken cancellationToken)
        {
            var id = new WishlistImportanceId(request.Id);
            var option = await importanceRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: importance => UpdateEntity(importance, request, cancellationToken),
                None: () => Task.FromResult<Either<WishlistImportanceException, WishlistImportance>>(
                    new WishlistImportanceNotFoundException(id)));
        }

        private async Task<Either<WishlistImportanceException, WishlistImportance>> UpdateEntity(
            WishlistImportance importance,
            UpdateWishlistImportanceCommand request,
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

                importance.Update(
                    name: request.Name,
                    level: request.Level);

                var updated = await importanceRepository.UpdateAsync(importance, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    importance.Id,
                    importance.Name,
                    importance.Level,
                    importance.CreatedAt
                });

                await historyObserver.EntityUpdatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "WishlistImportance",
                    entityId: importance.Id.Value.ToString(),
                    oldValues: oldValues,
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledWishlistImportanceException(importance.Id, ex);
            }
        }
    }
}
