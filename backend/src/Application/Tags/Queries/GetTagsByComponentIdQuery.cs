using Application.Common.Interfaces.Queries;
using Domain.Components;
using Domain.Tags;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Tags.Queries
{
    public sealed record GetTagsByComponentIdQuery(Guid ComponentId)
            : IRequest<IReadOnlyList<Tag>>;
    public sealed class GetTagsByComponentIdQueryHandler(
        ITagQueries tagQueries)
        : IRequestHandler<GetTagsByComponentIdQuery, IReadOnlyList<Tag>>
    {
        public async Task<IReadOnlyList<Tag>> Handle(
            GetTagsByComponentIdQuery request,
            CancellationToken cancellationToken)
        {
            var componentId = new ComponentId(request.ComponentId);
            return await tagQueries.GetByComponentIdAsync(componentId, cancellationToken);
        }
    }
}
