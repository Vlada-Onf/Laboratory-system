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
    public class UpdateDamagedComponentCommandHandler(
        IDamagedComponentRepository damagedComponentRepository,
        IDamagedComponentReasonRepository reasonRepository)
        : IRequestHandler<UpdateDamagedComponentCommand, Either<DamagedComponentException, DamagedComponent>>
    {
        public async Task<Either<DamagedComponentException, DamagedComponent>> Handle(
            UpdateDamagedComponentCommand request,
            CancellationToken cancellationToken)
        {
            var id = new DamagedComponentId(request.Id);
            var damagedOption = await damagedComponentRepository.GetByIdAsync(id, cancellationToken);

            return await damagedOption.MatchAsync(
                Some: damaged => UpdateEntity(damaged, request, cancellationToken),
                None: () => Task.FromResult<Either<DamagedComponentException, DamagedComponent>>(
                    new DamagedComponentNotFoundException(id)));
        }

        private async Task<Either<DamagedComponentException, DamagedComponent>> UpdateEntity(
            DamagedComponent damaged,
            UpdateDamagedComponentCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                var reasonId = new DamagedComponentReasonId(request.ReasonId);
                var reasonOption = await reasonRepository.GetByIdAsync(reasonId, cancellationToken);
                if (reasonOption.IsNone)
                {
                    return new DamagedComponentReasonNotFoundException(damaged.Id);
                }

                var componentId = new ComponentId(request.ComponentId);
                var lastUpdatedBy = new UserId(request.LastUpdatedBy);

                damaged.Update(
                    componentId,
                    reasonId,
                    request.Quantity,
                    lastUpdatedBy);

                var updated = await damagedComponentRepository.UpdateAsync(damaged, cancellationToken);

                return updated;
            }
            catch (Exception exception)
            {
                return new UnhandledDamagedComponentException(damaged.Id, exception);
            }
        }
    }
}
