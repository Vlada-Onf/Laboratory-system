using Application.Common.Interfaces.Queries;
using Domain.Components;
using Domain.Components.UsefulLink;
using MediatR;

namespace Application.UsefulLink.Queries
{
    public sealed record GetComponentUsefulLinksByComponentIdQuery(Guid ComponentId)
            : IRequest<IReadOnlyList<ComponentUsefulLink>>;
    public sealed class GetComponentUsefulLinksByComponentIdQueryHandler(
        IComponentUsefulLinkQueries queries)
        : IRequestHandler<GetComponentUsefulLinksByComponentIdQuery, IReadOnlyList<ComponentUsefulLink>>
    {
        public async Task<IReadOnlyList<ComponentUsefulLink>> Handle(
            GetComponentUsefulLinksByComponentIdQuery request,
            CancellationToken cancellationToken)
        {
            var componentId = new ComponentId(request.ComponentId);
            return await queries.GetByComponentIdAsync(componentId, cancellationToken);
        }
    }
}
