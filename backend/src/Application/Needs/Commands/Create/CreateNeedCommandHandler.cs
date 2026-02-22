using Application.Common.Interfaces.Repositories;
using Application.Needs.Exceptions;
using Application.HistoryEntries;
using Domain.Components;
using Domain.Needs;
using Domain.Needs.Importance;
using Domain.Needs.Status;
using Domain.Users;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Needs.Commands.Create
{
    public sealed class CreateNeedCommandHandler(
        INeedRepository needRepository,
        IComponentRepository componentRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<CreateNeedCommand, Either<NeedException, Need>>
    {
        public async Task<Either<NeedException, Need>> Handle(
            CreateNeedCommand request,
            CancellationToken cancellationToken)
        {
            NeedId? needId = null;

            try
            {
                var componentId = new ComponentId(request.ComponentId);

                var componentOption =
                    await componentRepository.GetByIdAsync(componentId, cancellationToken);

                if (componentOption.IsNone)
                    return new UnhandledNeedException(NeedId.Empty());

                var requestedBy = new UserId(request.RequestedBy);
                var importanceId = new NeedImportanceId(request.ImportanceId);
                var statusId = new NeedStatusId(request.StatusId);

                var need = Need.Create(
                    componentId: componentId,
                    quantityNeeded: request.QuantityNeeded,
                    requestedBy: requestedBy,
                    description: request.Description,
                    importanceId: importanceId,
                    statusId: statusId,
                    completionReason: request.CompletionReason);

                needId = need.Id;

                var created = await needRepository.AddAsync(need, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    need.Id,
                    need.ComponentId,
                    need.QuantityNeeded,
                    need.RequestedBy,
                    need.RequestedAt,
                    need.Description,
                    need.ImportanceId,
                    need.StatusId,
                    need.CompletionReason
                });

                await historyObserver.EntityCreatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "Need",
                    entityId: need.Id.Value.ToString(),
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedException(
                    needId ?? NeedId.Empty(),
                    ex);
            }
        }
    }
}
