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

namespace Application.DamagedComponents.Commands.Create
{
    public sealed class CreateDamagedComponentCommandHandler(
        IDamagedComponentRepository damagedComponentRepository,
        IComponentRepository componentRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<CreateDamagedComponentCommand, Either<DamagedComponentException, DamagedComponent>>
    {
        public async Task<Either<DamagedComponentException, DamagedComponent>> Handle(
            CreateDamagedComponentCommand request,
            CancellationToken cancellationToken)
        {
            DamagedComponentId? damagedId = null;

            try
            {
                var componentId = new ComponentId(request.ComponentId);
                var reasonId = new DamagedComponentReasonId(request.ReasonId);
                var recordedBy = new UserId(request.RecordedBy);

                var componentOption = await componentRepository.GetByIdAsync(componentId, cancellationToken);
                if (componentOption.IsNone)
                    return new UnhandledDamagedComponentException(DamagedComponentId.Empty());

                var damaged = DamagedComponent.Create(
                    componentId: componentId,
                    reasonId: reasonId,
                    quantity: request.Quantity,
                    recordedBy: recordedBy);

                damagedId = damaged.Id;

                var created = await damagedComponentRepository.AddAsync(damaged, cancellationToken);

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

                await historyObserver.EntityCreatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "DamagedComponent",
                    entityId: damaged.Id.Value.ToString(),
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledDamagedComponentException(
                    damagedId ?? DamagedComponentId.Empty(),
                    ex);
            }
        }
    }
}
