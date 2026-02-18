using Domain.Users;
using MediatR;

namespace Application.Users.Commands.SyncUserFromClerk
{
    public record SyncUserFromClerkCommand(
        string ClerkId,
        string Email,
        string FirstName,
        string LastName
    ) : IRequest<User>;
}
