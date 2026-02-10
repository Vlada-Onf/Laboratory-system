using Application.Common.Interfaces.Queries;
using Domain.Components;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Components.Queries
{
    public record GetComponentByIdQuery(Guid Id) : IRequest<Option<Component>>;

    public class GetComponentByIdQueryHandler(IComponentQueries queries)
        : IRequestHandler<GetComponentByIdQuery, Option<Component>>
    {
        public async Task<Option<Component>> Handle(
            GetComponentByIdQuery request,
            CancellationToken cancellationToken)
        {
            var componentId = new ComponentId(request.Id);
            return await queries.GetByIdAsync(componentId, cancellationToken);
        }
    }
}
