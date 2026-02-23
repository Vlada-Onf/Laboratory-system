using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.NeedsStatus.Exceptions;
using Domain.Needs.Status;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.NeedsStatus.Commands.Create
{
    public sealed class CreateNeedStatusCommandHandler(
        INeedStatusRepository statusRepository,
        IHistoryObserver historyObserver)
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

                var newValues = JsonSerializer.Serialize(new
                {
                    status.Id,
                    status.Name,
                    status.Description,
                    status.CreatedAt
                });

                await historyObserver.EntityCreatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "NeedStatus",
                    entityId: status.Id.Value.ToString(),
                    newValues: newValues,
                    cancellationToken: cancellationToken);

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
