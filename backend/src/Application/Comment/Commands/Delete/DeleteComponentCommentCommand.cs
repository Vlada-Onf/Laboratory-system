using Application.Comment.Exceptions;
using Domain.Components.Comment;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Comment.Commands.Delete
{
    public sealed record DeleteComponentCommentCommand(Guid Id)
            : IRequest<Either<ComponentCommentException, ComponentComment>>;
}
