using Application.Users.Exceptions;
using Domain.Users;
using LanguageExt;
using MediatR;

namespace Application.Users.Commands.Delete
{
    public record DeleteUserCommand(Guid Id, Guid PerformedBy)
        : IRequest<Either<UserException, User>>;
}
