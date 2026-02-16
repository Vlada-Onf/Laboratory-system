using Application.Common.Interfaces.Queries;
using Domain.Needs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Needs.Queries
{
    public sealed record GetAllNeedsQuery()
           : IRequest<IReadOnlyList<Need>>;
    public sealed class GetAllNeedsQueryHandler(
        INeedQueries queries)
        : IRequestHandler<GetAllNeedsQuery, IReadOnlyList<Need>>
    {
        public async Task<IReadOnlyList<Need>> Handle(
            GetAllNeedsQuery request,
            CancellationToken cancellationToken)
        {
            return await queries.GetAllAsync(cancellationToken);
        }
    }
}
