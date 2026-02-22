using Application.Actions.Exceptions;
using LanguageExt;
using MediatR;

namespace Application.Actions.Commands.Update
{
    public sealed record UpdateActionCommand
        : IRequest<Either<ActionException, Action>>
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public string? Description { get; init; }
        public required Guid UserId { get; init; }
    }
}
