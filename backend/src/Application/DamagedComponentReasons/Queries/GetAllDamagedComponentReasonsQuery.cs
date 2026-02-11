using Application.Common.Interfaces.Queries;
using Domain.DamagedComponents.Reason;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DamagedComponentReasons.Queries
{
    public sealed record GetAllDamagedComponentReasonsQuery
            : IRequest<IReadOnlyList<DamagedComponentReason>>;
    public sealed class GetAllDamagedComponentReasonsQueryHandler(
        IDamagedComponentReasonQueries queries)
        : IRequestHandler<GetAllDamagedComponentReasonsQuery, IReadOnlyList<DamagedComponentReason>>
    {
        public async Task<IReadOnlyList<DamagedComponentReason>> Handle(
            GetAllDamagedComponentReasonsQuery request,
            CancellationToken cancellationToken)
        {
            return await queries.GetAllAsync(cancellationToken);
        }
    }
}
