using Application.Common.Interfaces.Repositories;
// using Application.HistoryEntries.Commands.Create;
using Application.Needs.Exceptions;
using Domain.Needs;
using Domain.Needs.Importance;
using Domain.Needs.Status;
using LanguageExt;
using MediatR;

namespace Application.Needs.Commands.Update
{
    public sealed class UpdateNeedDetailsCommandHandler(
        INeedRepository needRepository,
        IActionRepository actionRepository,
        IEntityTypeRepository entityTypeRepository,
        ISender sender)
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
                // var oldQuantity = need.QuantityNeeded;
                // var oldDescription = need.Description;
                // var oldImportanceId = need.ImportanceId;
                // var oldStatusId = need.StatusId;

                var importanceId = new NeedImportanceId(request.ImportanceId);
                var statusId = new NeedStatusId(request.StatusId);

                need.UpdateDetails(
                    quantityNeeded: request.QuantityNeeded,
                    description: request.Description,
                    importanceId: importanceId,
                    statusId: statusId,
                    completionReason: request.CompletionReason);


                var updated = await needRepository.UpdateAsync(need, cancellationToken);

                // ІСТОРІЯ тимчасово відключена
                // var actionOption = await actionRepository.GetByNameAsync(
                //     "Update need details", cancellationToken);
                // if (actionOption.IsNone)
                //     throw new InvalidOperationException("Action 'Update need details' not found");
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
                //     UserId = request.PerformedBy,
                //     ActionId = action.Id.Value,
                //     EntityTypeId = entityType.Id.Value,
                //     EntityId = need.Id.Value.ToString(),
                //     OldValues =
                //         $"Quantity={oldQuantity}, Description={oldDescription}, " +
                //         $"ImportanceId={oldImportanceId.Value}, StatusId={oldStatusId.Value}",
                //     NewValues =
                //         $"Quantity={need.QuantityNeeded}, Description={need.Description}, " +
                //         $"ImportanceId={need.ImportanceId.Value}, StatusId={need.StatusId.Value}"
                // };
                //
                // var historyResult = await sender.Send(historyCommand, cancellationToken);
                // historyResult.IfLeft(e => throw e);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedException(need.Id, ex);
            }
        }
    }
}
