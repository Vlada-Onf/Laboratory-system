using Application.Common.Interfaces.Repositories;
using Application.DamagedComponentReasons.Exceptions;
using Domain.DamagedComponents.Reason;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DamagedComponentReasons.Commands.Update
{
    public sealed class UpdateDamagedComponentReasonCommandHandler(
        IDamagedComponentReasonRepository reasonRepository)
        : IRequestHandler<UpdateDamagedComponentReasonCommand, Either<DamagedComponentReasonException, DamagedComponentReason>>
    {
        public async Task<Either<DamagedComponentReasonException, DamagedComponentReason>> Handle(
            UpdateDamagedComponentReasonCommand request,
            CancellationToken cancellationToken)
        {
            var reasonId = new DamagedComponentReasonId(request.Id);
            var option = await reasonRepository.GetByIdAsync(reasonId, cancellationToken);

            return await option.MatchAsync(
                Some: reason => UpdateEntity(reason, request, cancellationToken),
                None: () => Task.FromResult<Either<DamagedComponentReasonException, DamagedComponentReason>>(
                    new DamagedComponentReasonNotFoundException(reasonId)));
        }

        private async Task<Either<DamagedComponentReasonException, DamagedComponentReason>> UpdateEntity(
            DamagedComponentReason reason,
            UpdateDamagedComponentReasonCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                reason.Update(request.Name, request.Description);

                var updated = await reasonRepository.UpdateAsync(reason, cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledDamagedComponentReasonException(reason.Id, ex);
            }
        }
    }
}