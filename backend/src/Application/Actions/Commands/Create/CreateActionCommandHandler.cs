using Application.Actions.Exceptions;
using Application.Common.Interfaces.Repositories;
using Domain.History.Actions;
using LanguageExt;
using MediatR;

namespace Application.Actions.Commands.Create
{
    public sealed class CreateActionCommandHandler(
    IActionRepository actionRepository)
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