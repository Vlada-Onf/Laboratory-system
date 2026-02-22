using Application.Comment.Exceptions;
using Domain.Components.Comment;
using LanguageExt;
using MediatR;

namespace Application.Comment.Commands.Delete
{
    public sealed record DeleteComponentCommentCommand(Guid Id, Guid PerformedBy)
        : IRequest<Either<ComponentCommentException, ComponentComment>>;
}
