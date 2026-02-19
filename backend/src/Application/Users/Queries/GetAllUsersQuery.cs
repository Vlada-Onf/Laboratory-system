using Application.Common.Interfaces.Queries;
using Domain.Users;
using MediatR;

namespace Application.Users.Queries
{
    public sealed record GetAllUsersQuery : IRequest<IReadOnlyList<User>>;

    public sealed class GetAllUsersQueryHandler(
        IUserQueries userQueries)
        : IRequestHandler<GetAllUsersQuery, IReadOnlyList<User>>
    {
        public async Task<IReadOnlyList<User>> Handle(
            GetAllUsersQuery request,
            CancellationToken cancellationToken)
        {
            return await userQueries.GetAllAsync(cancellationToken);
        }
    }
}
