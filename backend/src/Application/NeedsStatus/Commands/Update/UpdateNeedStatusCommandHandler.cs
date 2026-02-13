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

namespace Application.NeedsStatus.Commands.Update
{
    public sealed class UpdateNeedStatusCommandHandler(
            INeedStatusRepository statusRepository)
            : IRequestHandler<UpdateNeedStatusCommand, Either<NeedStatusException, NeedStatus>>
    {
        public async Task<Either<NeedStatusException, NeedStatus>> Handle(
            UpdateNeedStatusCommand request,
            CancellationToken cancellationToken)
        {
            var id = new NeedStatusId(request.Id);
            var option = await statusRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: status => UpdateEntity(status, request, cancellationToken),
                None: () => Task.FromResult<Either<NeedStatusException, NeedStatus>>(
                    new NeedStatusNotFoundException(id)));
        }

        private async Task<Either<NeedStatusException, NeedStatus>> UpdateEntity(
            NeedStatus status,
            UpdateNeedStatusCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                status.Update(
                    name: request.Name,
                    description: request.Description);

                var updated = await statusRepository.UpdateAsync(status, cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedStatusException(status.Id, ex);
            }
        }
    }
}
