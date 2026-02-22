using Application.Common.Interfaces.Repositories;
using Application.Components.Exceptions;
using Domain.Components;
using LanguageExt;
using MediatR;

namespace Application.Components.Commands.Delete
{
    public sealed record DeleteComponentCommand(Guid Id, Guid PerformedBy)
        : IRequest<Either<ComponentException, Component>>;
}
