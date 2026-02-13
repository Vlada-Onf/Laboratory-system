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

namespace Application.NeedsImportance.Commands.Delete
{
    public sealed class DeleteNeedImportanceCommandHandler(
            INeedImportanceRepository importanceRepository)
            : IRequestHandler<DeleteNeedImportanceCommand, Either<NeedImportanceException, NeedImportance>>
    {
        public async Task<Either<NeedImportanceException, NeedImportance>> Handle(
            DeleteNeedImportanceCommand request,
            CancellationToken cancellationToken)
        {
            var id = new NeedImportanceId(request.Id);
            var option = await importanceRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: importance => DeleteEntity(importance, cancellationToken),
                None: () => Task.FromResult<Either<NeedImportanceException, NeedImportance>>(
                    new NeedImportanceNotFoundException(id)));
        }

        private async Task<Either<NeedImportanceException, NeedImportance>> DeleteEntity(
            NeedImportance importance,
            CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await importanceRepository.DeleteAsync(importance, cancellationToken);
                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedImportanceException(importance.Id, ex);
            }
        }
    }
}