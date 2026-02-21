using Application.Actions.Exceptions;
using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Domain.History.Actions;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Actions.Commands.Create
{
    public sealed class CreateActionCommandHandler(
        IActionRepository actionRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<CreateActionCommand, Either<ActionException, Action>>
    {
        public async Task<Either<ActionException, Action>> Handle(
            CreateActionCommand request,
            CancellationToken cancellationToken)
        {
            var existing = await actionRepository.GetByNameAsync(
                request.Name,
                cancellationToken);

            return await existing.MatchAsync(
                Some: a => Task.FromResult<Either<ActionException, Action>>(
                    new ActionAlreadyExistException(a.Id)),
                None: () => CreateEntity(request, cancellationToken));
        }

        private async Task<Either<ActionException, Action>> CreateEntity(
            CreateActionCommand request,
            CancellationToken cancellationToken)
        {
            ActionId? actionId = null;

            try
            {
                var action = Action.Create(
                    name: request.Name,
                    description: request.Description);

                actionId = action.Id;

                var created = await actionRepository.AddAsync(action, cancellationToken);
                var newValues = JsonSerializer.Serialize(new
                {
                    action.Id,
                    action.Name,
                    action.Description,
                    action.CreatedAt
                });

                var userId = Guid.Empty;
                await historyObserver.EntityCreatedAsync(
                    userId: userId,
                    entityTypeName: "Action",
                    entityId: action.Id.Value.ToString(),
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledActionException(
                    actionId ?? ActionId.Empty(),
                    ex);
            }
        }
    }
}
