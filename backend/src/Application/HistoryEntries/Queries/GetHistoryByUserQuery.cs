using Application.Common.Interfaces.Queries;
using Domain.Users;
using MediatR;
using Domain.History;

namespace Application.HistoryEntries.Queries
{
    public sealed record GetHistoryByUserQuery(Guid UserId)
        : IRequest<IReadOnlyList<History>>;
    public sealed class GetHistoryByUserQueryHandler(
        IHistoryQueries queries)
        : IRequestHandler<GetHistoryByUserQuery, IReadOnlyList<History>>
    {
        public async Task<IReadOnlyList<History>> Handle(
            GetHistoryByUserQuery request,
            CancellationToken cancellationToken)
        {
            var userId = new UserId(request.UserId);
            return await queries.GetByUserAsync(userId, cancellationToken);
        }
    }
}