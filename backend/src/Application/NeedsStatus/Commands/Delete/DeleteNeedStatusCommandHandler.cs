using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.NeedsStatus.Exceptions;
using Domain.Needs.Status;
using LanguageExt;
using MediatR;
using System.Text.Json;


namespace Application.NeedsStatus.Commands.Delete
{
    public sealed class DeleteNeedStatusCommandHandler(
            INeedStatusRepository statusRepository,
            IHistoryObserver historyObserver)
            : IRequestHandler<DeleteNeedStatusCommand, Either<NeedStatusException, NeedStatus>>
    {
        public async Task<Either<NeedStatusException, NeedStatus>> Handle(
            DeleteNeedStatusCommand request,
            CancellationToken cancellationToken)
        {
            var id = new NeedStatusId(request.Id);
            var option = await statusRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: status => DeleteEntity(status, request.PerformedBy, cancellationToken),
                None: () => Task.FromResult<Either<NeedStatusException, NeedStatus>>(
                    new NeedStatusNotFoundException(id)));
        }

        private async Task<Either<NeedStatusException, NeedStatus>> DeleteEntity(
            NeedStatus status,
            Guid performedBy,
            CancellationToken cancellationToken)
        {
            try
            {
                var oldValues = JsonSerializer.Serialize(new
                {
                    status.Id,
                    status.Name,
                    status.Description,
                    status.CreatedAt
                });

                var deleted = await statusRepository.DeleteAsync(status, cancellationToken);

                await historyObserver.EntityDeletedAsync(
                    userId: performedBy,
                    entityTypeName: "NeedStatus",
                    entityId: status.Id.Value.ToString(),
                    oldValues: oldValues,
                    cancellationToken: cancellationToken);

                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedStatusException(status.Id, ex);
            }
        }
    }
}

