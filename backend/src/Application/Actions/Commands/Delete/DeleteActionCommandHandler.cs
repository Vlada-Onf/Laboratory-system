using Application.Actions.Exceptions;
using Application.Common.Interfaces.Repositories;
using Domain.History.Actions;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Actions.Commands.Delete
{
    public sealed class DeleteActionCommandHandler(
         IActionRepository actionRepository)
         : IRequestHandler<DeleteActionCommand, Either<ActionException, Action>>
    {
        public async Task<Either<ActionException, Action>> Handle(
            DeleteActionCommand request,
            CancellationToken cancellationToken)
        {
            var actionId = new ActionId(request.Id);
            var option = await actionRepository.GetByIdAsync(actionId, cancellationToken);

            return await option.MatchAsync(
                Some: action => DeleteEntity(action, cancellationToken),
                None: () => Task.FromResult<Either<ActionException, Action>>(
                    new ActionNotFoundException(actionId)));
        }

        private async Task<Either<ActionException, Action>> DeleteEntity(
            Action action,
            CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await actionRepository.DeleteAsync(action, cancellationToken);
                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledActionException(action.Id, ex);
            }
        }
    }
}