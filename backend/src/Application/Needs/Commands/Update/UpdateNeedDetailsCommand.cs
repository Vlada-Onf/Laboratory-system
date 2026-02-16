using Application.Needs.Exceptions;
using Domain.Needs;
using LanguageExt;
using MediatR;

namespace Application.Needs.Commands.Update
{
    public sealed record UpdateNeedDetailsCommand
        : IRequest<Either<NeedException, Need>>
    {
        public required Guid Id { get; init; }
        public required int QuantityNeeded { get; init; }
        public string? Description { get; init; }
        public required Guid ImportanceId { get; init; }
        public required Guid StatusId { get; init; }
        public required Guid PerformedBy { get; init; }
    }
}
