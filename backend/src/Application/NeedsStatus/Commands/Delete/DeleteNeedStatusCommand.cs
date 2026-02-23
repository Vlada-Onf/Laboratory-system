using Application.NeedsStatus.Exceptions;
using Domain.Needs.Status;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.NeedsStatus.Commands.Delete
{
    public sealed record DeleteNeedStatusCommand(Guid Id, Guid PerformedBy)
        : IRequest<Either<NeedStatusException, NeedStatus>>;
}
