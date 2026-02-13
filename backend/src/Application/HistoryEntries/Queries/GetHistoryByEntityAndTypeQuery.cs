using Application.Common.Interfaces.Queries;
using Domain.History.EntityTypes;
using MediatR;
using Domain.History;

namespace Application.HistoryEntries.Queries
{
    public sealed record GetHistoryByEntityAndTypeQuery(
        Guid EntityTypeId,
        string EntityId)
        : IRequest<IReadOnlyList<History>>;
    public sealed class GetHistoryByEntityAndTypeQueryHandler(
        IHistoryQueries queries)
        : IRequestHandler<GetHistoryByEntityAndTypeQuery, IReadOnlyList<History>>
    {
        public async Task<IReadOnlyList<History>> Handle(
            GetHistoryByEntityAndTypeQuery request,
            CancellationToken cancellationToken)
        {
            var entityTypeId = new EntityTypeId(request.EntityTypeId);
            return await queries.GetByEntityAndTypeAsync(
                entityTypeId,
                request.EntityId,
                cancellationToken);
        }
    }
}
