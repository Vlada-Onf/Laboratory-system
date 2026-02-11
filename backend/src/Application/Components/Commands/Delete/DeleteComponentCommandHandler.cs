using Application.Common.Interfaces.Repositories;
using Application.Components.Exceptions;
using Domain.Components;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Components.Commands.Delete
{
    public class DeleteComponentCommandHandler(
         IComponentRepository componentRepository)
         : IRequestHandler<DeleteComponentCommand, Either<ComponentException, Component>>
    {
        public async Task<Either<ComponentException, Component>> Handle(
            DeleteComponentCommand request,
            CancellationToken cancellationToken)
        {
            var componentId = new ComponentId(request.Id);
            var option = await componentRepository.GetByIdAsync(componentId, cancellationToken);

            return await option.MatchAsync(
                Some: component => DeleteEntity(component, cancellationToken),
                None: () => Task.FromResult<Either<ComponentException, Component>>(
                    new ComponentNotFoundException(componentId)));
        }

        private async Task<Either<ComponentException, Component>> DeleteEntity(
            Component component,
            CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await componentRepository.DeleteAsync(component, cancellationToken);
                return deleted;
            }
            catch (Exception exception)
            {
                return new UnhandledComponentException(component.Id, exception);
            }
        }
    }
}