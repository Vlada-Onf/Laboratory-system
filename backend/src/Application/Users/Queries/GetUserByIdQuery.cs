using Application.Common.Interfaces.Queries;
using Domain.Users;
using LanguageExt;
using MediatR;

namespace Application.Users.Queries
{
    public sealed record GetUserByIdQuery(Guid Id) : IRequest<Option<User>>;

    public sealed class GetUserByIdQueryHandler(
        IUserQueries userQueries)
        : IRequestHandler<GetUserByIdQuery, Option<User>>
    {
        public async Task<Option<User>> Handle(
            GetUserByIdQuery request,
            CancellationToken cancellationToken)
        {
            return await userQueries.GetByIdAsync(new UserId(request.Id), cancellationToken);
        }
    }
}
