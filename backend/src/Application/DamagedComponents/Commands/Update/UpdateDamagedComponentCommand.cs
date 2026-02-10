using Application.DamagedComponents.Exceptions;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DamagedComponents.Commands.Update
{
    public record UpdateDamagedComponentCommand
    : IRequest<Either<DamagedComponentException, DamagedComponent>>
    {
        public required Guid Id { get; init; }
        public required Guid ComponentId { get; init; }
        public required Guid ReasonId { get; init; }
        public required int Quantity { get; init; }
        public required Guid LastUpdatedBy { get; init; }
    }
}
