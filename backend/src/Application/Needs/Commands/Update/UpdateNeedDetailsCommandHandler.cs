using Application.Common.Interfaces.Repositories;
using Application.Needs.Exceptions;
using Application.HistoryEntries;
using Domain.Needs;
using Domain.Needs.Importance;
using Domain.Needs.Status;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Needs.Commands.Update
{
    public sealed class UpdateNeedDetailsCommandHandler(
        INeedRepository needRepository,
        IHistoryObserver historyObserver)
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
                var oldValues = JsonSerializer.Serialize(new
                {
                    need.Id,
                    need.ComponentId,
                    need.QuantityNeeded,
                    need.Description,
                    need.ImportanceId,
                    need.StatusId,
                    need.CompletionReason
                });

                var importanceId = new NeedImportanceId(request.ImportanceId);
                var statusId = new NeedStatusId(request.StatusId);

                need.UpdateDetails(
                    quantityNeeded: request.QuantityNeeded,
                    description: request.Description,
                    importanceId: importanceId,
                    statusId: statusId,
                    completionReason: request.CompletionReason);

                var updated = await needRepository.UpdateAsync(need, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    need.Id,
                    need.ComponentId,
                    need.QuantityNeeded,
                    need.Description,
                    need.ImportanceId,
                    need.StatusId,
                    need.CompletionReason
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
