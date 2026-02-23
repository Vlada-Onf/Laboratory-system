using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.NeedsStatus.Exceptions;
using Domain.Needs.Status;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.NeedsStatus.Commands.Update
{
    public sealed class UpdateNeedStatusCommandHandler(
            INeedStatusRepository statusRepository,
            IHistoryObserver historyObserver)
            : IRequestHandler<UpdateNeedStatusCommand, Either<NeedStatusException, NeedStatus>>
    {
        public async Task<Either<NeedStatusException, NeedStatus>> Handle(
            UpdateNeedStatusCommand request,
            CancellationToken cancellationToken)
        {
            var id = new NeedStatusId(request.Id);
            var option = await statusRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: status => UpdateEntity(status, request, cancellationToken),
                None: () => Task.FromResult<Either<NeedStatusException, NeedStatus>>(
                    new NeedStatusNotFoundException(id)));
        }

        private async Task<Either<NeedStatusException, NeedStatus>> UpdateEntity(
            NeedStatus status,
            UpdateNeedStatusCommand request,
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

                status.Update(
                    name: request.Name,
                    description: request.Description);

                var updated = await statusRepository.UpdateAsync(status, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    status.Id,
                    status.Name,
                    status.Description,
                    status.CreatedAt
                });

                await historyObserver.EntityUpdatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "NeedStatus",
                    entityId: status.Id.Value.ToString(),
                    oldValues: oldValues,
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedStatusException(status.Id, ex);
            }
        }
    }
}

