using Application.Common.Interfaces.Queries;
using Domain.Components;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DamagedComponents.Queries
{
    public record GetDamagedComponentsByComponentIdQuery(Guid ComponentId)
        : IRequest<IReadOnlyList<DamagedComponent>>;

    public class GetDamagedComponentsByComponentIdQueryHandler(
        IDamagedComponentQueries queries)
        : IRequestHandler<GetDamagedComponentsByComponentIdQuery, IReadOnlyList<DamagedComponent>>
    {
        public async Task<IReadOnlyList<DamagedComponent>> Handle(
            GetDamagedComponentsByComponentIdQuery request,
            CancellationToken cancellationToken)
        {
            var componentId = new ComponentId(request.ComponentId);
            return await queries.GetByComponentIdAsync(componentId, cancellationToken);
        }
    }
}
