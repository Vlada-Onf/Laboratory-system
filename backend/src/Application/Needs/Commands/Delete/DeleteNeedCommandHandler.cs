using Application.Common.Interfaces.Repositories;
// using Application.HistoryEntries.Commands.Create;
using Application.Needs.Exceptions;
using Domain.Needs;
using LanguageExt;
using MediatR;

namespace Application.Needs.Commands.Delete
{
    public sealed class DeleteNeedCommandHandler(
        INeedRepository needRepository,
        IActionRepository actionRepository,
        IEntityTypeRepository entityTypeRepository,
        ISender sender)
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
                // var oldValues =
                //     $"NeedId={need.Id.Value}, ComponentId={need.ComponentId.Value}, " +
                //     $"Quantity={need.QuantityNeeded}, ImportanceId={need.ImportanceId.Value}, " +
                //     $"StatusId={need.StatusId.Value}";

                var deleted = await needRepository.DeleteAsync(need, cancellationToken);

                // ІСТОРІЯ тимчасово відключена
                // var actionOption = await actionRepository.GetByNameAsync(
                //     "Delete need", cancellationToken);
                // if (actionOption.IsNone)
                //     throw new InvalidOperationException("Action 'Delete need' not found");
                // var action = actionOption.First();
                //
                // var entityTypeOption = await entityTypeRepository.GetByNameAsync(
                //     "Need", cancellationToken);
                // if (entityTypeOption.IsNone)
                //     throw new InvalidOperationException("EntityType 'Need' not found");
                // var entityType = entityTypeOption.First();
                //
                // var historyCommand = new CreateHistoryCommand
                // {
                //     UserId = performedBy,
                //     ActionId = action.Id.Value,
                //     EntityTypeId = entityType.Id.Value,
                //     EntityId = need.Id.Value.ToString(),
                //     OldValues = oldValues,
                //     NewValues = null
                // };
                //
                // var historyResult = await sender.Send(historyCommand, cancellationToken);
                // historyResult.IfLeft(e => throw e);

                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedException(need.Id, ex);
            }
        }
    }
}
