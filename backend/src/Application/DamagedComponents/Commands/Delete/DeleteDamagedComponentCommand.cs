using Application.DamagedComponents.Exceptions;
using LanguageExt;
using MediatR;
using System;
namespace Application.DamagedComponents.Commands.Delete
{
    public record DeleteDamagedComponentCommand(Guid Id)
        : IRequest<Either<DamagedComponentException, MediatR.Unit>>;
}
