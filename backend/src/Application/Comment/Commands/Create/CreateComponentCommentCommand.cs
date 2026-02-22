using Application.Comment.Exceptions;
using Domain.Components.Comment;
using LanguageExt;
using MediatR;

namespace Application.Comment.Commands.Create
{
    public sealed record CreateComponentCommentCommand
        : IRequest<Either<ComponentCommentException, ComponentComment>>
    {
        public required Guid ComponentId { get; init; }
        public required string Content { get; init; }
        public required Guid CreatedBy { get; init; }
        public required Guid PerformedBy { get; init; }
    }
}
