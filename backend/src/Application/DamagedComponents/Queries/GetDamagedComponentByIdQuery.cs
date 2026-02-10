using Application.Common.Interfaces.Queries;
using Domain.DamagedComponents;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DamagedComponents.Queries
{
    public record GetDamagedComponentByIdQuery(Guid Id)
        : IRequest<Option<DamagedComponent>>;

    public class GetDamagedComponentByIdQueryHandler(
        IDamagedComponentQueries queries)
        : IRequestHandler<GetDamagedComponentByIdQuery, Option<DamagedComponent>>
    {
        public async Task<Option<DamagedComponent>> Handle(
            GetDamagedComponentByIdQuery request,
            CancellationToken cancellationToken)
        {
            var damagedId = new DamagedComponentId(request.Id);
            return await queries.GetByIdAsync(damagedId, cancellationToken);
        }
    }
}
