using Application.DamagedComponents.Exceptions;
using LanguageExt;
using MediatR;

namespace Application.DamagedComponents.Commands.Create
{
    public sealed record CreateDamagedComponentCommand
            : IRequest<Either<DamagedComponentException, DamagedComponent>>
    {
        public required Guid ComponentId { get; init; }
        public required Guid ReasonId { get; init; }
        public required int Quantity { get; init; }
        public required Guid RecordedBy { get; init; }
    }
}
