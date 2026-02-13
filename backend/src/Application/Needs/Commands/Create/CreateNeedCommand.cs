using Application.Needs.Exceptions;
using Domain.Needs;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Needs.Commands.Create
{
    public sealed record CreateNeedCommand
        : IRequest<Either<NeedException, Need>>
    {
        public required Guid ComponentId { get; init; }
        public required int QuantityNeeded { get; init; }
        public required Guid RequestedBy { get; init; }
        public string? Description { get; init; }
        public required Guid ImportanceId { get; init; }
    }
}
