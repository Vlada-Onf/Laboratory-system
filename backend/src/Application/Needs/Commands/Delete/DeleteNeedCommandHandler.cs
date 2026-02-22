using Application.Common.Interfaces.Repositories;
using Application.Needs.Exceptions;
using Application.HistoryEntries;
using Domain.Needs;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Needs.Commands.Delete
{
    public sealed class DeleteNeedCommandHandler(
        INeedRepository needRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<DeleteNeedCommand, Either<NeedException, Need>>
    {
        public async Task<Either<NeedException, Need>> Handle(
            DeleteNeedCommand request,
            CancellationToken cancellationToken)
        {
            var needId = new NeedId(request.Id);
            var option = await needRepository.GetByIdAsync(needId, cancellationToken);

            return await option.MatchAsync(
                Some: need => DeleteEntity(need, request.PerformedBy, cancellationToken),
                None: () => Task.FromResult<Either<NeedException, Need>>(
                    new NeedNotFoundException(needId)));
        }

        private async Task<Either<NeedException, Need>> DeleteEntity(
            Need need,
            Guid performedBy,
            CancellationToken cancellationToken)
        {
            try
            {
                var oldValues = JsonSerializer.Serialize(new
                {
                    need.Id,
                    need.ComponentId,
                    need.QuantityNeeded,
                    need.RequestedBy,
                    need.RequestedAt,
                    need.Description,
                    need.ImportanceId,
                    need.StatusId,
                    need.CompletionReason,
                    need.CompletedAt
                });

                var deleted = await needRepository.DeleteAsync(need, cancellationToken);

                await historyObserver.EntityDeletedAsync(
                    userId: performedBy,
                    entityTypeName: "Need",
                    entityId: need.Id.Value.ToString(),
                    oldValues: oldValues,
                    cancellationToken: cancellationToken);

                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedException(need.Id, ex);
            }
        }
    }
}
