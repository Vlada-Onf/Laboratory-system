using Application.Common.Interfaces.Repositories;
// using Application.HistoryEntries.Commands.Create;
using Application.Needs.Exceptions;
using Domain.Components;
using Domain.Needs;
using Domain.Needs.Importance;
using Domain.Needs.Status;
using Domain.Users;
using LanguageExt;
using MediatR;

namespace Application.Needs.Commands.Create
{
    public sealed class CreateNeedCommandHandler(
            INeedRepository needRepository,
            IComponentRepository componentRepository,
            IActionRepository actionRepository,
            IEntityTypeRepository entityTypeRepository,
            ISender sender)
        : IRequestHandler<CreateNeedCommand, Either<NeedException, Need>>
    {
        public async Task<Either<NeedException, Need>> Handle(
            CreateNeedCommand request,
            CancellationToken cancellationToken)
        {
            NeedId? needId = null;

            try
            {
                var componentId = new ComponentId(request.ComponentId);

                var componentOption =
                    await componentRepository.GetByIdAsync(componentId, cancellationToken);

                if (componentOption.IsNone)
                    return new UnhandledNeedException(NeedId.Empty());

                var requestedBy = new UserId(request.RequestedBy);
                var importanceId = new NeedImportanceId(request.ImportanceId);
                var statusId = new NeedStatusId(request.StatusId);

                var need = Need.Create(
                    componentId: componentId,
                    quantityNeeded: request.QuantityNeeded,
                    requestedBy: requestedBy,
                    description: request.Description,
                    importanceId: importanceId,
                    statusId: statusId);

                needId = need.Id;

                var created = await needRepository.AddAsync(need, cancellationToken);

                // ІСТОРІЯ тимчасово відключена
                // var actionOption = await actionRepository.GetByNameAsync(
                //     "Create need", cancellationToken);
                // if (actionOption.IsNone)
                //     throw new InvalidOperationException("Action 'Create need' not found");
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
                //     EntityId = created.Id.Value.ToString(),
                //     OldValues = null,
                //     NewValues =
                //         $"ComponentId={need.ComponentId.Value}, " +
                //         $"Quantity={need.QuantityNeeded}, " +
                //         $"StatusId={need.StatusId.Value}, " +
                //         $"ImportanceId={need.ImportanceId.Value}, " +
                //         $"Description={need.Description}"
                // };
                //
                // var historyResult = await sender.Send(historyCommand, cancellationToken);
                // historyResult.IfLeft(e => throw e);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedException(
                    needId ?? NeedId.Empty(),
                    ex);
            }
        }
    }
}
