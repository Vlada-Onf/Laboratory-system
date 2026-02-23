using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.NeedsImportance.Exceptions;
using Domain.Needs.Importance;
using Domain.Users;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.NeedsImportance.Commands.Create
{
    public sealed class CreateNeedImportanceCommandHandler(
        INeedImportanceRepository importanceRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<CreateNeedImportanceCommand, Either<NeedImportanceException, NeedImportance>>
    {
        public async Task<Either<NeedImportanceException, NeedImportance>> Handle(
            CreateNeedImportanceCommand request,
            CancellationToken cancellationToken)
        {
            var existing = await importanceRepository.GetByLevelAsync(
                request.Level,
                cancellationToken);

            return await existing.MatchAsync(
                Some: _ => Task.FromResult<Either<NeedImportanceException, NeedImportance>>(
                    new NeedImportanceAlreadyExistForLevelException(request.Level)),
                None: () => CreateEntity(request, cancellationToken));
        }

        private async Task<Either<NeedImportanceException, NeedImportance>> CreateEntity(
            CreateNeedImportanceCommand request,
            CancellationToken cancellationToken)
        {
            NeedImportanceId? id = null;

            try
            {
                var importance = NeedImportance.Create(
                    name: request.Name,
                    level: request.Level);

                id = importance.Id;

                var created = await importanceRepository.AddAsync(importance, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    importance.Id,
                    importance.Name,
                    importance.Level,
                    importance.CreatedAt
                });

                await historyObserver.EntityCreatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "NeedImportance",
                    entityId: importance.Id.Value.ToString(),
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedImportanceException(
                    id ?? NeedImportanceId.Empty(),
                    ex);
            }
        }
    }
}
