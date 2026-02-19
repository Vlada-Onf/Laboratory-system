using Application.Users.Exceptions;
using Domain.Users;
using LanguageExt;
using MediatR;

namespace Application.Users.Commands.Update
{
    public record UpdateSelfProfileCommand : IRequest<Either<UserException, User>>
    {
        public required Guid Id { get; init; }
        public required string FirstName { get; init; }
        public required string LastName { get; init; }
        public string? PhotoUrl { get; init; }
    }
}
