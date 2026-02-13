using Application.Comment.Exceptions;
using Domain.Components.Comment;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Comment.Commands.Update
{
    public sealed record UpdateComponentCommentCommand
            : IRequest<Either<ComponentCommentException, ComponentComment>>
    {
        public required Guid Id { get; init; }
        public required string Content { get; init; }
    }
}
