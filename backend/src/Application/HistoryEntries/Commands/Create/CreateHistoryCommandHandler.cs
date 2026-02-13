using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries.Exceptions;
using Domain.History;
using Domain.History.Actions;
using Domain.History.EntityTypes;
using Domain.Users;
using LanguageExt;
using MediatR;

namespace Application.HistoryEntries.Commands.Create
{
    public sealed class CreateHistoryCommandHandler(
        IHistoryRepository historyRepository)
        : IRequestHandler<CreateHistoryCommand, Either<HistoryException, History>>
    {
        public async Task<Either<HistoryException, History>> Handle(
            CreateHistoryCommand request,
            CancellationToken cancellationToken)
        {
            HistoryId? historyId = null;

            try
            {
                var userId = new UserId(request.UserId);
                var actionId = new ActionId(request.ActionId);
                var entityTypeId = new EntityTypeId(request.EntityTypeId);

                var entry = Domain.History.History.Create(
                    userId: userId,
                    actionId: actionId,
                    entityTypeId: entityTypeId,
                    entityId: request.EntityId,
                    oldValues: request.OldValues,
                    newValues: request.NewValues);

                historyId = entry.Id;

                var created = await historyRepository.AddAsync(entry, cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledHistoryException(
                    historyId ?? HistoryId.Empty(),
                    ex);
            }
        }
    }
}