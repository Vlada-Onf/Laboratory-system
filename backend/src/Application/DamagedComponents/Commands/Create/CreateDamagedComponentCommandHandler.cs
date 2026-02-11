using Application.Common.Interfaces.Repositories;
using Application.DamagedComponents.Exceptions;
using Domain.Components;
using Domain.DamagedComponents;
using Domain.DamagedComponents.Reason;
using Domain.Users;
using LanguageExt;
using MediatR;

namespace Application.DamagedComponents.Commands.Create
{
    public sealed class CreateDamagedComponentCommandHandler(
        IDamagedComponentRepository damagedComponentRepository,
        IComponentRepository componentRepository)
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