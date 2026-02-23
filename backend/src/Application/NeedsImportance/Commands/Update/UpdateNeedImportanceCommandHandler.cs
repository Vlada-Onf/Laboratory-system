using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.NeedsImportance.Exceptions;
using Domain.Needs.Importance;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.NeedsImportance.Commands.Update
{
    public sealed class UpdateNeedImportanceCommandHandler(
            INeedImportanceRepository importanceRepository,
            IHistoryObserver historyObserver)
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
                var oldValues = JsonSerializer.Serialize(new
                {
                    importance.Id,
                    importance.Name,
                    importance.Level,
                    importance.CreatedAt
                });

                importance.Update(
                    name: request.Name,
                    level: request.Level);

                var updated = await importanceRepository.UpdateAsync(importance, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    importance.Id,
                    importance.Name,
                    importance.Level,
                    importance.CreatedAt
                });

                await historyObserver.EntityUpdatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "NeedImportance",
                    entityId: importance.Id.Value.ToString(),
                    oldValues: oldValues,
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedImportanceException(importance.Id, ex);
            }
        }
    }
}
