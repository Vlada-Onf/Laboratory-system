using Application.DamagedComponentReasons.Exceptions;
using Domain.DamagedComponents.Reason;
using LanguageExt;
using MediatR;

namespace Application.DamagedComponentReasons.Commands.Update
{
    public sealed record UpdateDamagedComponentReasonCommand
        : IRequest<Either<DamagedComponentReasonException, DamagedComponentReason>>
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public string? Description { get; init; }
        public required Guid PerformedBy { get; init; }
    }
}
