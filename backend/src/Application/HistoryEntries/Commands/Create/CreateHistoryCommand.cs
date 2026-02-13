using Application.HistoryEntries.Exceptions;
using LanguageExt;
using MediatR;
using Domain.History;

namespace Application.HistoryEntries.Commands.Create
{
    public sealed record CreateHistoryCommand
            : IRequest<Either<HistoryException, History>>
    {
        public required Guid UserId { get; init; }
        public required Guid ActionId { get; init; }
        public required Guid EntityTypeId { get; init; }
        public required string EntityId { get; init; }
        public string? OldValues { get; init; }
        public string? NewValues { get; init; }
    }
}
