using Application.Common.Interfaces.Repositories;
using Application.DamagedComponentReasons.Exceptions;
using Application.HistoryEntries;
using Domain.DamagedComponents.Reason;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.DamagedComponentReasons.Commands.Create
{
    public sealed class CreateDamagedComponentReasonCommandHandler(
        IDamagedComponentReasonRepository reasonRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<CreateDamagedComponentReasonCommand, Either<DamagedComponentReasonException, DamagedComponentReason>>
    {
        public async Task<Either<DamagedComponentReasonException, DamagedComponentReason>> Handle(
            CreateDamagedComponentReasonCommand request,
            CancellationToken cancellationToken)
        {
            DamagedComponentReasonId? reasonId = null;

            try
            {
                var reason = DamagedComponentReason.Create(
                    name: request.Name,
                    description: request.Description);

                reasonId = reason.Id;

                var created = await reasonRepository.AddAsync(reason, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    reason.Id,
                    reason.Name,
                    reason.Description
                });

                await historyObserver.EntityCreatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "DamagedComponentReason",
                    entityId: reason.Id.Value.ToString(),
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledDamagedComponentReasonException(
                    reasonId ?? DamagedComponentReasonId.Empty(),
                    ex);
            }
        }
    }
}
