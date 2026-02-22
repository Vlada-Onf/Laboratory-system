using Application.DamagedComponents.Exceptions;
using Domain.DamagedComponents;
using LanguageExt;
using MediatR;

namespace Application.DamagedComponents.Commands.Delete
{
    public sealed record DeleteDamagedComponentCommand(Guid Id, Guid PerformedBy)
        : IRequest<Either<DamagedComponentException, DamagedComponent>>;
}
