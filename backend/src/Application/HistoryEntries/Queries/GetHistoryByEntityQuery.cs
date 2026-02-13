using Application.Common.Interfaces.Queries;
using MediatR;
using Domain.History;

namespace Application.HistoryEntries.Queries
{
    public sealed record GetHistoryByEntityQuery(string EntityId)
        : IRequest<IReadOnlyList<History>>;
    public sealed class GetHistoryByEntityQueryHandler(
        IHistoryQueries queries)
        : IRequestHandler<GetHistoryByEntityQuery, IReadOnlyList<History>>
    {
        public async Task<IReadOnlyList<History>> Handle(
            GetHistoryByEntityQuery request,
            CancellationToken cancellationToken)
        {
            return await queries.GetByEntityAsync(request.EntityId, cancellationToken);
        }
    }
}
