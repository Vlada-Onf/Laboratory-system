using Application.Common.Interfaces.Repositories;
using Application.UsefulLink.Exceptions;
using Domain.Components;
using Domain.Components.UsefulLink;
using Domain.Users;
using LanguageExt;
using MediatR;

namespace Application.UsefulLink.Commands.Create
{
    public sealed class CreateComponentUsefulLinkCommandHandler(
            IComponentUsefulLinkRepository linkRepository,
            IComponentRepository componentRepository)
            : IRequestHandler<CreateComponentUsefulLinkCommand, Either<ComponentUsefulLinkException, ComponentUsefulLink>>
    {
        public async Task<Either<ComponentUsefulLinkException, ComponentUsefulLink>> Handle(
            CreateComponentUsefulLinkCommand request,
            CancellationToken cancellationToken)
        {
            ComponentUsefulLinkId? id = null;

            try
            {
                var componentId = new ComponentId(request.ComponentId);

                var componentOption = await componentRepository.GetByIdAsync(componentId, cancellationToken);
                if (componentOption.IsNone)
                    return new UnhandledComponentUsefulLinkException(ComponentUsefulLinkId.Empty());

                var createdBy = new UserId(request.CreatedBy);

                var link = ComponentUsefulLink.New(
                    componentId: componentId,
                    title: request.Title,
                    url: request.Url,
                    createdBy: createdBy);

                id = link.Id;

                var created = await linkRepository.AddAsync(link, cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledComponentUsefulLinkException(
                    id ?? ComponentUsefulLinkId.Empty(),
                    ex);
            }
        }
    }
}
