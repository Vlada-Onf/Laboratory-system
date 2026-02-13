using Application.Common.Interfaces.Repositories;
using Application.NeedsImportance.Exceptions;
using Domain.Needs.Importance;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.NeedsImportance.Commands.Update
{
    public sealed class UpdateNeedImportanceCommandHandler(
            INeedImportanceRepository importanceRepository)
            : IRequestHandler<UpdateNeedImportanceCommand, Either<NeedImportanceException, NeedImportance>>
    {
        public async Task<Either<NeedImportanceException, NeedImportance>> Handle(
            UpdateNeedImportanceCommand request,
            CancellationToken cancellationToken)
        {
            var id = new NeedImportanceId(request.Id);
            var option = await importanceRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: importance => UpdateEntity(importance, request, cancellationToken),
                None: () => Task.FromResult<Either<NeedImportanceException, NeedImportance>>(
                    new NeedImportanceNotFoundException(id)));
        }

        private async Task<Either<NeedImportanceException, NeedImportance>> UpdateEntity(
            NeedImportance importance,
            UpdateNeedImportanceCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                importance.Update(
                    name: request.Name,
                    level: request.Level);

                var updated = await importanceRepository.UpdateAsync(importance, cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedImportanceException(importance.Id, ex);
            }
        }
    }
}
