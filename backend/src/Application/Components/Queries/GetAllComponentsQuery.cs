using Application.Common.Interfaces.Queries;
using Domain.Components;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Components.Queries
{
    public record GetAllComponentsQuery : IRequest<IReadOnlyList<Component>>;

    public class GetAllComponentsQueryHandler(IComponentQueries queries)
        : IRequestHandler<GetAllComponentsQuery, IReadOnlyList<Component>>
    {
        public async Task<IReadOnlyList<Component>> Handle(
            GetAllComponentsQuery request,
            CancellationToken cancellationToken)
        {
            return await queries.GetAllAsync(cancellationToken);
        }
    }
}
