using Application.Common.Interfaces.Queries;
using Domain.Users;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Users.Queries
{
    public sealed record GetUserByClerkIdQuery(string ClerkId) : IRequest<Option<User>>;

    public sealed class GetUserByClerkIdQueryHandler(
        IUserQueries userQueries)
        : IRequestHandler<GetUserByClerkIdQuery, Option<User>>
    {
        public async Task<Option<User>> Handle(
            GetUserByClerkIdQuery request,
            CancellationToken cancellationToken)
        {
            return await userQueries.GetByClerkIdAsync(request.ClerkId, cancellationToken);
        }
    }
}
