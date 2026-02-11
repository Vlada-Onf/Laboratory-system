using Application.Common.Interfaces.Queries;
using Domain.Components;
using MediatR;


namespace Application.DamagedComponents.Queries
{
    public sealed record GetDamagedComponentsByComponentIdQuery(Guid ComponentId)
        : IRequest<IReadOnlyList<DamagedComponent>>;

    public sealed class GetDamagedComponentsByComponentIdQueryHandler(
        IDamagedComponentQueries damagedQueries)
        : IRequestHandler<GetDamagedComponentsByComponentIdQuery, IReadOnlyList<DamagedComponent>>
    {
        public async Task<IReadOnlyList<DamagedComponent>> Handle(
            GetDamagedComponentsByComponentIdQuery request,
            CancellationToken cancellationToken)
        {
            var componentId = new ComponentId(request.ComponentId);
            return await damagedQueries.GetByComponentIdAsync(componentId, cancellationToken);
        }
    }
}
