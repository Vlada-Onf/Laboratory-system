using Application.DamagedComponents.Exceptions;
using LanguageExt;
using MediatR;
using System;
namespace Application.DamagedComponents.Commands.Delete
{
    public sealed record DeleteDamagedComponentCommand(Guid Id)
            : IRequest<Either<DamagedComponentException, DamagedComponent>>;
}
