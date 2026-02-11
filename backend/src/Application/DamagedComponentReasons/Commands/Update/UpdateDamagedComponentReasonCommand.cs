using Application.DamagedComponentReasons.Exceptions;
using Domain.DamagedComponents.Reason;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DamagedComponentReasons.Commands.Update
{
    public sealed record UpdateDamagedComponentReasonCommand
        : IRequest<Either<DamagedComponentReasonException, DamagedComponentReason>>
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public string? Description { get; init; }
    }
}