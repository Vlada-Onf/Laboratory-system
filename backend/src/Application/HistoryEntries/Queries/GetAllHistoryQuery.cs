using Application.Common.Interfaces.Queries;
using Domain.History;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.HistoryEntries.Queries
{
    public sealed record GetAllHistoryQuery()
            : IRequest<IReadOnlyList<History>>;

    public sealed class GetAllHistoryQueryHandler(
        IHistoryQueries queries)
        : IRequestHandler<GetAllHistoryQuery, IReadOnlyList<History>>
    {
        public async Task<IReadOnlyList<History>> Handle(
            GetAllHistoryQuery request,
            CancellationToken cancellationToken)
        {
            return await queries.GetAllAsync(cancellationToken);
        }
    }
}
