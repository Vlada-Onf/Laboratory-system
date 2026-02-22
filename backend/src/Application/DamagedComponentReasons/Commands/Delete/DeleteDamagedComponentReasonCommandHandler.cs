using Application.Common.Interfaces.Repositories;
using Application.DamagedComponentReasons.Exceptions;
using Application.HistoryEntries;
using Domain.DamagedComponents.Reason;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.DamagedComponentReasons.Commands.Delete
{
    public sealed class DeleteDamagedComponentReasonCommandHandler(
        IDamagedComponentReasonRepository reasonRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<DeleteDamagedComponentReasonCommand, Either<DamagedComponentReasonException, DamagedComponentReason>>
    {
        public async Task<Either<DamagedComponentReasonException, DamagedComponentReason>> Handle(
            DeleteDamagedComponentReasonCommand request,
            CancellationToken cancellationToken)
        {
            var reasonId = new DamagedComponentReasonId(request.Id);
            var option = await reasonRepository.GetByIdAsync(reasonId, cancellationToken);

            return await option.MatchAsync(
                Some: reason => DeleteEntity(reason, request.PerformedBy, cancellationToken),
                None: () => Task.FromResult<Either<DamagedComponentReasonException, DamagedComponentReason>>(
                    new DamagedComponentReasonNotFoundException(reasonId)));
        }

        private async Task<Either<DamagedComponentReasonException, DamagedComponentReason>> DeleteEntity(
            DamagedComponentReason reason,
            Guid performedBy,
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

                var deleted = await reasonRepository.DeleteAsync(reason, cancellationToken);

                await historyObserver.EntityDeletedAsync(
                    userId: performedBy,
                    entityTypeName: "DamagedComponentReason",
                    entityId: reason.Id.Value.ToString(),
                    oldValues: oldValues,
                    cancellationToken: cancellationToken);

                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledDamagedComponentReasonException(reason.Id, ex);
            }
        }
    }
}
