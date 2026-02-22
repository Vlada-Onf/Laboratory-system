using Application.Common.Interfaces.Repositories;
using Application.DamagedComponentReasons.Exceptions;
using Application.HistoryEntries;
using Domain.DamagedComponents.Reason;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.DamagedComponentReasons.Commands.Update
{
    public sealed class UpdateDamagedComponentReasonCommandHandler(
        IDamagedComponentReasonRepository reasonRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<UpdateDamagedComponentReasonCommand, Either<DamagedComponentReasonException, DamagedComponentReason>>
    {
        public async Task<Either<DamagedComponentReasonException, DamagedComponentReason>> Handle(
            UpdateDamagedComponentReasonCommand request,
            CancellationToken cancellationToken)
        {
            var reasonId = new DamagedComponentReasonId(request.Id);
            var option = await reasonRepository.GetByIdAsync(reasonId, cancellationToken);

            return await option.MatchAsync(
                Some: reason => UpdateEntity(reason, request, cancellationToken),
                None: () => Task.FromResult<Either<DamagedComponentReasonException, DamagedComponentReason>>(
                    new DamagedComponentReasonNotFoundException(reasonId)));
        }

        private async Task<Either<DamagedComponentReasonException, DamagedComponentReason>> UpdateEntity(
            DamagedComponentReason reason,
            UpdateDamagedComponentReasonCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                var oldValues = JsonSerializer.Serialize(new
                {
                    reason.Id,
                    reason.Name,
                    reason.Description
                });

                reason.Update(request.Name, request.Description);

                var updated = await reasonRepository.UpdateAsync(reason, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    reason.Id,
                    reason.Name,
                    reason.Description
                });

                await historyObserver.EntityUpdatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "DamagedComponentReason",
                    entityId: reason.Id.Value.ToString(),
                    oldValues: oldValues,
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledDamagedComponentReasonException(reason.Id, ex);
            }
        }
    }
}
