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

namespace Application.NeedsStatus.Commands.Create
{
    public sealed class CreateNeedStatusCommandHandler(
        INeedStatusRepository statusRepository)
        : IRequestHandler<CreateNeedStatusCommand, Either<NeedStatusException, NeedStatus>>
    {
        public async Task<Either<NeedStatusException, NeedStatus>> Handle(
            CreateNeedStatusCommand request,
            CancellationToken cancellationToken)
        {
            var existing = await statusRepository.GetByNameAsync(
                request.Name,
                cancellationToken);

            return await existing.MatchAsync(
                Some: s => Task.FromResult<Either<NeedStatusException, NeedStatus>>(
                    new NeedStatusAlreadyExistException(s.Id)),
                None: () => CreateEntity(request, cancellationToken));
        }

        private async Task<Either<NeedStatusException, NeedStatus>> CreateEntity(
            CreateNeedStatusCommand request,
            CancellationToken cancellationToken)
        {
            NeedStatusId? id = null;

            try
            {
                var status = NeedStatus.Create(
                    name: request.Name,
                    description: request.Description);

                id = status.Id;

                var created = await statusRepository.AddAsync(status, cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedStatusException(
                    id ?? NeedStatusId.Empty(),
                    ex);
            }
        }
    }
}
