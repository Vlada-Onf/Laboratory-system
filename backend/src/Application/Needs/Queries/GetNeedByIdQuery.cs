using Application.Common.Interfaces.Queries;
using Domain.Needs;
using LanguageExt;
using MediatR;

namespace Application.Needs.Queries
{
    public sealed record GetNeedByIdQuery(Guid Id)
        : IRequest<Option<Need>>;
    public sealed class GetNeedByIdQueryHandler(
    INeedQueries queries)
    : IRequestHandler<GetNeedByIdQuery, Option<Need>>
    {
        public async Task<Option<Need>> Handle(
            GetNeedByIdQuery request,
            CancellationToken cancellationToken)
        {
            var id = new NeedId(request.Id);
            return await queries.GetByIdAsync(id, cancellationToken);
        }
    }
}
