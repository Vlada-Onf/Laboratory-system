using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries.Commands.Create;
using Application.Needs.Exceptions;
using Domain.Needs;
using Domain.Needs.Importance;
using LanguageExt;
using MediatR;

namespace Application.Needs.Commands.Update
{
    public sealed class UpdateNeedImportanceCommandHandler(
        INeedRepository needRepository,
        IActionRepository actionRepository,
        IEntityTypeRepository entityTypeRepository,
        ISender sender)
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
                var oldImportanceId = need.ImportanceId;
                var importanceId = new NeedImportanceId(request.ImportanceId);

                need.UpdateImportance(importanceId);

                var updated = await needRepository.UpdateAsync(need, cancellationToken);

                var actionOption = await actionRepository.GetByNameAsync(
                    "Update need importance", cancellationToken);
                if (actionOption.IsNone)
                    throw new InvalidOperationException("Action 'Update need importance' not found");
                var action = actionOption.First();

                var entityTypeOption = await entityTypeRepository.GetByNameAsync(
                    "Need", cancellationToken);
                if (entityTypeOption.IsNone)
                    throw new InvalidOperationException("EntityType 'Need' not found");
                var entityType = entityTypeOption.First();

                var historyCommand = new CreateHistoryCommand
                {
                    UserId = request.PerformedBy,
                    ActionId = action.Id.Value,
                    EntityTypeId = entityType.Id.Value,
                    EntityId = need.Id.Value.ToString(),
                    OldValues = $"ImportanceId={oldImportanceId.Value}",
                    NewValues = $"ImportanceId={need.ImportanceId.Value}"
                };

                var historyResult = await sender.Send(historyCommand, cancellationToken);
                historyResult.IfLeft(e => throw e);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedException(need.Id, ex);
            }
        }
    }
}
