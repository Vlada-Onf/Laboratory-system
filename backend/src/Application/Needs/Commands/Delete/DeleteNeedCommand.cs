using Application.Needs.Exceptions;
using Domain.Needs;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Needs.Commands.Delete
{
    public sealed record DeleteNeedCommand(Guid Id)
        : IRequest<Either<NeedException, Need>>;
}
