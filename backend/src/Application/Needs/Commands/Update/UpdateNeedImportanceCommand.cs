using Application.Needs.Exceptions;
using Domain.Needs;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Needs.Commands.Update
{
    public sealed record UpdateNeedImportanceCommand
            : IRequest<Either<NeedException, Need>>
    {
        public required Guid Id { get; init; }
        public required Guid ImportanceId { get; init; }
        public required Guid PerformedBy { get; init; }
    }
}
