using Application.Actions.Exceptions;
using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Domain.History.Actions;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Actions.Commands.Delete
{
    public sealed class DeleteActionCommandHandler(
     IActionRepository actionRepository,
     IHistoryObserver historyObserver)
     : IRequestHandler<DeleteActionCommand, Either<ActionException, Action>>
    {
        public async Task<Either<ActionException, Action>> Handle(
            DeleteActionCommand request,
            CancellationToken cancellationToken)
        {
            var actionId = new ActionId(request.Id);
            var option = await actionRepository.GetByIdAsync(actionId, cancellationToken);

            return await option.MatchAsync(
                Some: action => DeleteEntity(action, request, cancellationToken),
                None: () => Task.FromResult<Either<ActionException, Action>>(
                    new ActionNotFoundException(actionId)));
        }

        private async Task<Either<ActionException, Action>> DeleteEntity(
            Action action,
            DeleteActionCommand request,
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

                var deleted = await actionRepository.DeleteAsync(action, cancellationToken);

                await historyObserver.EntityDeletedAsync(
                    userId: request.UserId, 
                    entityTypeName: "Action",
                    entityId: action.Id.Value.ToString(),
                    oldValues: oldValues,
                    cancellationToken: cancellationToken);

                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledActionException(action.Id, ex);
            }
        }
    }
}
