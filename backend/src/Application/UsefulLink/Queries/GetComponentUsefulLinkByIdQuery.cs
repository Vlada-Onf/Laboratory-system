using Application.Common.Interfaces.Queries;
using Domain.Components.UsefulLink;
using LanguageExt;
using MediatR;
namespace Application.UsefulLink.Queries
{
    public sealed record GetComponentUsefulLinkByIdQuery(Guid Id)
            : IRequest<Option<ComponentUsefulLink>>;
    public sealed class GetComponentUsefulLinkByIdQueryHandler(
        IComponentUsefulLinkQueries queries)
        : IRequestHandler<GetComponentUsefulLinkByIdQuery, Option<ComponentUsefulLink>>
    {
        public async Task<Option<ComponentUsefulLink>> Handle(
            GetComponentUsefulLinkByIdQuery request,
            CancellationToken cancellationToken)
        {
            var id = new ComponentUsefulLinkId(request.Id);
            return await queries.GetByIdAsync(id, cancellationToken);
        }
    }
}
