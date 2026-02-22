using Application.Actions.Exceptions;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Actions.Commands.Delete
{
    public sealed record DeleteActionCommand(Guid Id, Guid UserId)
            : IRequest<Either<ActionException, Action>>;
}
