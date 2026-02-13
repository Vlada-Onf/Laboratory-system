using Application.Common.Interfaces.Repositories;
using Application.Needs.Exceptions;
using Domain.Needs;
using Domain.Needs.Importance;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Needs.Commands.Update
{
    public sealed class UpdateNeedDetailsCommandHandler(
        INeedRepository needRepository)
        : IRequestHandler<UpdateNeedDetailsCommand, Either<NeedException, Need>>
    {
        public async Task<Either<NeedException, Need>> Handle(
            UpdateNeedDetailsCommand request,
            CancellationToken cancellationToken)
        {
            var needId = new NeedId(request.Id);
            var option = await needRepository.GetByIdAsync(needId, cancellationToken);

            return await option.MatchAsync(
                Some: need => UpdateEntity(need, request, cancellationToken),
                None: () => Task.FromResult<Either<NeedException, Need>>(
                    new NeedNotFoundException(needId)));
        }

        private async Task<Either<NeedException, Need>> UpdateEntity(
            Need need,
            UpdateNeedDetailsCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                var importanceId = new NeedImportanceId(request.ImportanceId);

                need.UpdateDetails(
                    quantityNeeded: request.QuantityNeeded,
                    description: request.Description,
                    importanceId: importanceId);

                var updated = await needRepository.UpdateAsync(need, cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedException(need.Id, ex);
            }
        }
    }
}