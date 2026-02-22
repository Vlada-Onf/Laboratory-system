using Application.DamagedComponents.Exceptions;
using Domain.DamagedComponents;
using LanguageExt;
using MediatR;

namespace Application.DamagedComponents.Commands.Update
{
    public sealed record UpdateDamagedComponentCommand
        : IRequest<Either<DamagedComponentException, DamagedComponent>>
    {
        public required Guid Id { get; init; }
        public required Guid ComponentId { get; init; }
        public required Guid ReasonId { get; init; }
        public required int Quantity { get; init; }
        public required Guid LastUpdatedBy { get; init; }
        public required Guid PerformedBy { get; init; }
    }
}
