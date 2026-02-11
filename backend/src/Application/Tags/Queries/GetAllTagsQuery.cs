using Application.Common.Interfaces.Queries;
using Domain.Tags;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Tags.Queries
{
    public sealed record GetAllTagsQuery : IRequest<IReadOnlyList<Tag>>;

    public sealed class GetAllTagsQueryHandler(ITagQueries tagQueries)
        : IRequestHandler<GetAllTagsQuery, IReadOnlyList<Tag>>
    {
        public async Task<IReadOnlyList<Tag>> Handle(
            GetAllTagsQuery request,
            CancellationToken cancellationToken) {
            return await tagQueries.GetAllAsync(cancellationToken); }
    }
}
