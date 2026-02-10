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
    public class CreateDamagedComponentCommandHandler(
        IDamagedComponentRepository damagedComponentRepository,
        IDamagedComponentReasonRepository reasonRepository)
        : IRequestHandler<CreateDamagedComponentCommand, Either<DamagedComponentException, DamagedComponent>>
    {
        public async Task<Either<DamagedComponentException, DamagedComponent>> Handle(
            CreateDamagedComponentCommand request,
            CancellationToken cancellationToken)
        {
            var reasonId = new DamagedComponentReasonId(request.ReasonId);

            var reasonOption = await reasonRepository.GetByIdAsync(reasonId, cancellationToken);

            var reasonExists = reasonOption.IsSome;
            if (!reasonExists)
            {
                return new DamagedComponentReasonNotFoundException(DamagedComponentId.Empty);
            }

            return await CreateEntity(request, cancellationToken);
        }

        private async Task<Either<DamagedComponentException, DamagedComponent>> CreateEntity(
            CreateDamagedComponentCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                var componentId = new ComponentId(request.ComponentId);
                var reasonId = new DamagedComponentReasonId(request.ReasonId);
                var recordedBy = new UserId(request.RecordedBy);

                var damagedComponent = DamagedComponent.Create(
                    componentId,
                    reasonId,
                    request.Quantity,
                    recordedBy);

                var created = await damagedComponentRepository.AddAsync(damagedComponent, cancellationToken);

                return created;
            }
            catch (Exception exception)
            {
                return new UnhandledDamagedComponentException(DamagedComponentId.Empty, exception);
            }
        }
    }
}
