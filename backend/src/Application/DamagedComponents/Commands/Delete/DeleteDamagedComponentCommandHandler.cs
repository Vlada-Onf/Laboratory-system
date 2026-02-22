using Application.Common.Interfaces.Repositories;
using Application.DamagedComponents.Exceptions;
using Application.HistoryEntries;
using Domain.DamagedComponents;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.DamagedComponents.Commands.Delete
{
    public sealed class DeleteDamagedComponentCommandHandler(
        IDamagedComponentRepository damagedComponentRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<DeleteDamagedComponentCommand, Either<DamagedComponentException, DamagedComponent>>
    {
        public async Task<Either<DamagedComponentException, DamagedComponent>> Handle(
            DeleteDamagedComponentCommand request,
            CancellationToken cancellationToken)
        {
            var damagedId = new DamagedComponentId(request.Id);
            var option = await damagedComponentRepository.GetByIdAsync(damagedId, cancellationToken);

            return await option.MatchAsync(
                Some: damaged => DeleteEntity(damaged, request.PerformedBy, cancellationToken),
                None: () => Task.FromResult<Either<DamagedComponentException, DamagedComponent>>(
                    new DamagedComponentNotFoundException(damagedId)));
        }

        private async Task<Either<DamagedComponentException, DamagedComponent>> DeleteEntity(
            DamagedComponent damaged,
            Guid performedBy,
            CancellationToken cancellationToken)
        {
            try
            {
                var oldValues = JsonSerializer.Serialize(new
                {
                    damaged.Id,
                    damaged.ComponentId,
                    damaged.ReasonId,
                    damaged.Quantity,
                    damaged.RecordedAt,
                    damaged.RecordedBy,
                    damaged.LastUpdatedAt,
                    damaged.LastUpdatedBy
                });

                var deleted = await damagedComponentRepository.DeleteAsync(damaged, cancellationToken);

                await historyObserver.EntityDeletedAsync(
                    userId: performedBy,
                    entityTypeName: "DamagedComponent",
                    entityId: damaged.Id.Value.ToString(),
                    oldValues: oldValues,
                    cancellationToken: cancellationToken);

                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledDamagedComponentException(damaged.Id, ex);
            }
        }
    }
}
