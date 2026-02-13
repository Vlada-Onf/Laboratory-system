using Application.Common.Interfaces.Queries;
using Domain.Components;
using Domain.Needs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Needs.Queries
{
    public sealed record GetNeedsByComponentIdQuery(Guid ComponentId)
        : IRequest<IReadOnlyList<Need>>;
    public sealed class GetNeedsByComponentIdQueryHandler(
    INeedQueries queries)
    : IRequestHandler<GetNeedsByComponentIdQuery, IReadOnlyList<Need>>
    {
        public async Task<IReadOnlyList<Need>> Handle(
            GetNeedsByComponentIdQuery request,
            CancellationToken cancellationToken)
        {
            var componentId = new ComponentId(request.ComponentId);
            return await queries.GetByComponentIdAsync(componentId, cancellationToken);
        }
    }
}
