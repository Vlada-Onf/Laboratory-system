using Application.Common.Interfaces.Queries;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DamagedComponents.Queries
{
    public record GetAllDamagedComponentsQuery
    : IRequest<IReadOnlyList<DamagedComponent>>;

    public class GetAllDamagedComponentsQueryHandler(
        IDamagedComponentQueries queries)
        : IRequestHandler<GetAllDamagedComponentsQuery, IReadOnlyList<DamagedComponent>>
    {
        public async Task<IReadOnlyList<DamagedComponent>> Handle(
            GetAllDamagedComponentsQuery request,
            CancellationToken cancellationToken)
        {
            return await queries.GetAllAsync(cancellationToken);
        }
    }
}
