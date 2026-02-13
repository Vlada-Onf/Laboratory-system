using Application.Common.Interfaces.Queries;
using Domain.Components;
using Domain.Schematics;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Schematics.Queries
{
    public sealed record GetSchematicsByComponentIdQuery(Guid ComponentId)
            : IRequest<IReadOnlyList<Schematic>>;
    public sealed class GetSchematicsByComponentIdQueryHandler(
        ISchematicQueries queries)
        : IRequestHandler<GetSchematicsByComponentIdQuery, IReadOnlyList<Schematic>>
    {
        public async Task<IReadOnlyList<Schematic>> Handle(
            GetSchematicsByComponentIdQuery request,
            CancellationToken cancellationToken)
        {
            var componentId = new ComponentId(request.ComponentId);
            return await queries.GetByComponentIdAsync(componentId, cancellationToken);
        }
    }
}
