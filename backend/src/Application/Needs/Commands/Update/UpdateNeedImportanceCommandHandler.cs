using Application.Common.Interfaces.Repositories;
using Application.Needs.Exceptions;
using Application.HistoryEntries;
using Domain.Needs;
using Domain.Needs.Importance;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Needs.Commands.Update
{
    public sealed class UpdateNeedImportanceCommandHandler(
        INeedRepository needRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<UpdateNeedImportanceCommand, Either<NeedException, Need>>
    {
        public async Task<Either<NeedException, Need>> Handle(
            UpdateNeedImportanceCommand request,
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
            UpdateNeedImportanceCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                var oldValues = JsonSerializer.Serialize(new
                {
                    need.Id,
                    need.ImportanceId
                });

                var importanceId = new NeedImportanceId(request.ImportanceId);

                need.UpdateImportance(importanceId);

                var updated = await needRepository.UpdateAsync(need, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    need.Id,
                    need.ImportanceId
                });

                await historyObserver.EntityUpdatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "Need",
                    entityId: need.Id.Value.ToString(),
                    oldValues: oldValues,
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedException(need.Id, ex);
            }
        }
    }
}
