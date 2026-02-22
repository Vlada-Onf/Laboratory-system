using Application.Common.Interfaces.Repositories;
using Application.DamagedComponents.Exceptions;
using Application.HistoryEntries;
using Domain.Components;
using Domain.DamagedComponents;
using Domain.DamagedComponents.Reason;
using Domain.Users;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.DamagedComponents.Commands.Update
{
    public sealed class UpdateDamagedComponentCommandHandler(
        IDamagedComponentRepository damagedComponentRepository,
        IComponentRepository componentRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<UpdateDamagedComponentCommand, Either<DamagedComponentException, DamagedComponent>>
    {
        public async Task<Either<DamagedComponentException, DamagedComponent>> Handle(
            UpdateDamagedComponentCommand request,
            CancellationToken cancellationToken)
        {
            var damagedId = new DamagedComponentId(request.Id);
            var option = await damagedComponentRepository.GetByIdAsync(damagedId, cancellationToken);

            return await option.MatchAsync(
                Some: damaged => UpdateEntity(damaged, request, cancellationToken),
                None: () => Task.FromResult<Either<DamagedComponentException, DamagedComponent>>(
                    new DamagedComponentNotFoundException(damagedId)));
        }

        private async Task<Either<DamagedComponentException, DamagedComponent>> UpdateEntity(
            DamagedComponent damaged,
            UpdateDamagedComponentCommand request,
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

                var componentId = new ComponentId(request.ComponentId);
                var reasonId = new DamagedComponentReasonId(request.ReasonId);
                var lastUpdatedBy = new UserId(request.LastUpdatedBy);

                damaged.Update(
                    componentId: componentId,
                    reasonId: reasonId,
                    quantity: request.Quantity,
                    lastUpdatedBy: lastUpdatedBy);

                var updated = await damagedComponentRepository.UpdateAsync(damaged, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
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

                await historyObserver.EntityUpdatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "DamagedComponent",
                    entityId: damaged.Id.Value.ToString(),
                    oldValues: oldValues,
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledDamagedComponentException(damaged.Id, ex);
            }
        }
    }
}
