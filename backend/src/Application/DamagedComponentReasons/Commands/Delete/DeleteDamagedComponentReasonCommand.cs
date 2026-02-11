using Application.DamagedComponentReasons.Exceptions;
using Domain.DamagedComponents.Reason;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DamagedComponentReasons.Commands.Delete
{
    public sealed record DeleteDamagedComponentReasonCommand(Guid Id)
            : IRequest<Either<DamagedComponentReasonException, DamagedComponentReason>>;
}