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
    public sealed record GetComponentByIdQuery(Guid Id) : IRequest<Option<Component>>;
    public sealed class GetComponentByIdQueryHandler(
            IComponentQueries componentQueries)
            : IRequestHandler<GetComponentByIdQuery, Option<Component>>
    {
        public async Task<Option<Component>> Handle(
            GetComponentByIdQuery request,
            CancellationToken cancellationToken)
        {
            var componentId = new ComponentId(request.Id);
            return await componentQueries.GetByIdAsync(componentId, cancellationToken);
        }
    }
}
