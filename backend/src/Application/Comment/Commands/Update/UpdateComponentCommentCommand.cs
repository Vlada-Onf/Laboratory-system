using Application.Comment.Exceptions;
using Domain.Components.Comment;
using LanguageExt;
using MediatR;

namespace Application.Comment.Commands.Update
{
    public sealed record UpdateComponentCommentCommand
        : IRequest<Either<ComponentCommentException, ComponentComment>>
    {
        public required Guid Id { get; init; }
        public required string Content { get; init; }
        public required Guid PerformedBy { get; init; }
    }
}
