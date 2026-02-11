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

namespace Application.Actions.Commands.Update
{
    public sealed class UpdateActionCommandHandler(
         IActionRepository actionRepository)
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
                action.Update(request.Name, request.Description);

                var updated = await actionRepository.UpdateAsync(action, cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledActionException(action.Id, ex);
            }
        }
    }
}