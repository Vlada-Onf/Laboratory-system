using Application.NeedsStatus.Exceptions;
using Domain.Needs.Status;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.NeedsStatus.Commands.Create
{
    public sealed record CreateNeedStatusCommand
        : IRequest<Either<NeedStatusException, NeedStatus>>
    {
        public required string Name { get; init; }
        public string? Description { get; init; }
        public required Guid PerformedBy { get; init; }
    }
}
