using Application.Common.Interfaces.Queries;
using Domain.History.EntityTypes;
using MediatR;
using Domain.History;

namespace Application.HistoryEntries.Queries
{
    public sealed record GetHistoryByTypeQuery(Guid EntityTypeId)
        : IRequest<IReadOnlyList<History>>;

    public sealed class GetHistoryByTypeQueryHandler(
        IHistoryQueries queries)
        : IRequestHandler<GetHistoryByTypeQuery, IReadOnlyList<History>>
    {
        public async Task<IReadOnlyList<History>> Handle(
            GetHistoryByTypeQuery request,
            CancellationToken cancellationToken)
        {
            var entityTypeId = new EntityTypeId(request.EntityTypeId);

            return await queries.GetByTypeAsync(
                entityTypeId,
                cancellationToken);
        }
    }
}