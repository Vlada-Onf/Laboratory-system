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

namespace Application.DamagedComponentReasons.Commands.Delete
{
    public sealed class DeleteDamagedComponentReasonCommandHandler(
         IDamagedComponentReasonRepository reasonRepository)
         : IRequestHandler<DeleteDamagedComponentReasonCommand, Either<DamagedComponentReasonException, DamagedComponentReason>>
    {
        public async Task<Either<DamagedComponentReasonException, DamagedComponentReason>> Handle(
            DeleteDamagedComponentReasonCommand request,
            CancellationToken cancellationToken)
        {
            var reasonId = new DamagedComponentReasonId(request.Id);
            var option = await reasonRepository.GetByIdAsync(reasonId, cancellationToken);

            return await option.MatchAsync(
                Some: reason => DeleteEntity(reason, cancellationToken),
                None: () => Task.FromResult<Either<DamagedComponentReasonException, DamagedComponentReason>>(
                    new DamagedComponentReasonNotFoundException(reasonId)));
        }

        private async Task<Either<DamagedComponentReasonException, DamagedComponentReason>> DeleteEntity(
            DamagedComponentReason reason,
            CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await reasonRepository.DeleteAsync(reason, cancellationToken);
                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledDamagedComponentReasonException(reason.Id, ex);
            }
        }
    }
}