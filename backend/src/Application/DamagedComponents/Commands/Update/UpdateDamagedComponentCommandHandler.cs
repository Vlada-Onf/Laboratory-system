using Application.Common.Interfaces.Repositories;
using Application.DamagedComponents.Exceptions;
using Domain.Components;
using Domain.DamagedComponents;
using Domain.DamagedComponents.Reason;
using Domain.Users;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DamagedComponents.Commands.Update
{
    public sealed class UpdateDamagedComponentCommandHandler(
        IDamagedComponentRepository damagedComponentRepository,
        IComponentRepository componentRepository)
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
                var componentId = new ComponentId(request.ComponentId);
                var reasonId = new DamagedComponentReasonId(request.ReasonId);
                var lastUpdatedBy = new UserId(request.LastUpdatedBy);

                damaged.Update(
                    componentId: componentId,
                    reasonId: reasonId,
                    quantity: request.Quantity,
                    lastUpdatedBy: lastUpdatedBy);

                var updated = await damagedComponentRepository.UpdateAsync(damaged, cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledDamagedComponentException(damaged.Id, ex);
            }
        }
    }
}