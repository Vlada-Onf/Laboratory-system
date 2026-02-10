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
    public record DeleteComponentCommand(Guid Id, Guid DeletedBy)
     : IRequest<Either<ComponentException, MediatR.Unit>>; 

    public class DeleteComponentCommandHandler(IComponentRepository componentRepository)
        : IRequestHandler<DeleteComponentCommand, Either<ComponentException, MediatR.Unit>>
    {
        public async Task<Either<ComponentException, MediatR.Unit>> Handle(
            DeleteComponentCommand request,
            CancellationToken cancellationToken)
        {
            var componentId = new ComponentId(request.Id);

            var componentOption = await componentRepository.GetByIdAsync(componentId, cancellationToken);

            return await componentOption.MatchAsync(
                Some: async component =>
                {
                    try
                    {
                        await componentRepository.DeleteAsync(component, cancellationToken);
                        return MediatR.Unit.Value; 
                    }
                    catch (Exception exception)
                    {
                        return new UnhandledComponentException(componentId, exception);
                    }
                },
                None: () => Task.FromResult<Either<ComponentException, MediatR.Unit>>(
                    new ComponentNotFoundException(componentId)));
        }
    }
}
