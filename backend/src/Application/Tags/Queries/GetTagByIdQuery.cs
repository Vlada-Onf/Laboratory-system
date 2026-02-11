using Application.Common.Interfaces.Queries;
using Domain.Tags;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Tags.Queries
{
    public sealed record GetTagByIdQuery(Guid Id) : IRequest<Option<Tag>>;

    public sealed class GetTagByIdQueryHandler(
       ITagQueries tagQueries)
       : IRequestHandler<GetTagByIdQuery, Option<Tag>>
    {
        public async Task<Option<Tag>> Handle(
            GetTagByIdQuery request,
            CancellationToken cancellationToken)
        {
            var tagId = new TagId(request.Id);
            return await tagQueries.GetByIdAsync(tagId, cancellationToken);
        }
    }
}
