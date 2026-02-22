using Application.Actions.Exceptions;
using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Domain.History.Actions;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Actions.Commands.Update
{
    public sealed class UpdateActionCommandHandler(
        IActionRepository actionRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<UpdateActionCommand, Either<ActionException, Action>>
    {
        public async Task<Either<ActionException, Action>> Handle(
            UpdateActionCommand request,
            CancellationToken cancellationToken)
        {
            var actionId = new ActionId(request.Id);
            var option = await actionRepository.GetByIdAsync(actionId, cancellationToken);

            return await option.MatchAsync(
                Some: action => UpdateEntity(action, request, cancellationToken),
                None: () => Task.FromResult<Either<ActionException, Action>>(
                    new ActionNotFoundException(actionId)));
        }
        private async Task<Either<ActionException, Action>> UpdateEntity(
            Action action,
            UpdateActionCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                var oldValues = JsonSerializer.Serialize(new
                {
                    action.Id,
                    action.Name,
                    action.Description,
                    action.CreatedAt
                });

                action.Update(request.Name, request.Description);

                var updated = await actionRepository.UpdateAsync(action, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    action.Id,
                    action.Name,
                    action.Description,
                    action.CreatedAt
                });

                await historyObserver.EntityUpdatedAsync(
                    userId: request.UserId,
                    entityTypeName: "Action",
                    entityId: action.Id.Value.ToString(),
                    oldValues: oldValues,
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledActionException(action.Id, ex);
            }
        }
    }
}
