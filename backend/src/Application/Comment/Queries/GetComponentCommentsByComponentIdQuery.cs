using Application.Common.Interfaces.Queries;
using Domain.Components;
using Domain.Components.Comment;
using MediatR;

namespace Application.Comment.Queries
{
    public sealed record GetCommentsByComponentIdQuery(Guid ComponentId)
            : IRequest<IReadOnlyList<ComponentComment>>;

    public sealed class GetCommentsByComponentIdQueryHandler(
        IComponentCommentQueries queries)
        : IRequestHandler<GetCommentsByComponentIdQuery, IReadOnlyList<ComponentComment>>
    {
        public async Task<IReadOnlyList<ComponentComment>> Handle(
            GetCommentsByComponentIdQuery request,
            CancellationToken cancellationToken)
        {
            var componentId = new ComponentId(request.ComponentId);
            return await queries.GetByComponentIdAsync(componentId, cancellationToken);
        }
    }
}
