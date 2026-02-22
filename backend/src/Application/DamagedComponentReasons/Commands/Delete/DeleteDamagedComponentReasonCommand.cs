using Application.DamagedComponentReasons.Exceptions;
using Domain.DamagedComponents.Reason;
using LanguageExt;
using MediatR;

namespace Application.DamagedComponentReasons.Commands.Delete
{
    public sealed record DeleteDamagedComponentReasonCommand(Guid Id, Guid PerformedBy)
        : IRequest<Either<DamagedComponentReasonException, DamagedComponentReason>>;
}
