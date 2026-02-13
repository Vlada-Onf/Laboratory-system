using Application.Common.Interfaces.Queries;
using Domain.Components.Comment;
using LanguageExt;
using MediatR;

namespace Application.Comment.Queries
{
    public sealed record GetComponentCommentByIdQuery(Guid Id)
            : IRequest<Option<ComponentComment>>;
    public sealed class GetComponentCommentByIdQueryHandler(
        IComponentCommentQueries queries)
        : IRequestHandler<GetComponentCommentByIdQuery, Option<ComponentComment>>
    {
        public async Task<Option<ComponentComment>> Handle(
            GetComponentCommentByIdQuery request,
            CancellationToken cancellationToken)
        {
            var id = new ComponentCommentId(request.Id);
            return await queries.GetByIdAsync(id, cancellationToken);
        }
    }
}
