using Application.Common.Interfaces.Repositories;
using Application.NeedsStatus.Exceptions;
using Domain.Needs.Status;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.NeedsStatus.Commands.Delete
{
    public sealed class DeleteNeedStatusCommandHandler(
            INeedStatusRepository statusRepository)
            : IRequestHandler<DeleteNeedStatusCommand, Either<NeedStatusException, NeedStatus>>
    {
        public async Task<Either<NeedStatusException, NeedStatus>> Handle(
            DeleteNeedStatusCommand request,
            CancellationToken cancellationToken)
        {
            var id = new NeedStatusId(request.Id);
            var option = await statusRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: status => DeleteEntity(status, cancellationToken),
                None: () => Task.FromResult<Either<NeedStatusException, NeedStatus>>(
                    new NeedStatusNotFoundException(id)));
        }

        private async Task<Either<NeedStatusException, NeedStatus>> DeleteEntity(
            NeedStatus status,
            CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await statusRepository.DeleteAsync(status, cancellationToken);
                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedStatusException(status.Id, ex);
            }
        }
    }
}
