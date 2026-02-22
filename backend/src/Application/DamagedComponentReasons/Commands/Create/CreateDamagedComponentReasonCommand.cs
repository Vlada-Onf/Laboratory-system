using Application.DamagedComponentReasons.Exceptions;
using Domain.DamagedComponents.Reason;
using LanguageExt;
using MediatR;

namespace Application.DamagedComponentReasons.Commands.Create
{
    public sealed record CreateDamagedComponentReasonCommand
        : IRequest<Either<DamagedComponentReasonException, DamagedComponentReason>>
    {
        public required string Name { get; init; }
        public string? Description { get; init; }
        public required Guid PerformedBy { get; init; }
    }
}
