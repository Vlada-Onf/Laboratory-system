using Application.Needs.Exceptions;
using Domain.Needs;
using LanguageExt;
using MediatR;

namespace Application.Needs.Commands.Delete
{
    public sealed record DeleteNeedCommand(Guid Id, Guid PerformedBy)
        : IRequest<Either<NeedException, Need>>;
}
