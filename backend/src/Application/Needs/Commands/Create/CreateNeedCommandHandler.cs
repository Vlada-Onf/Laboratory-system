using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries.Commands.Create;
using Application.Needs.Exceptions;
using Domain.Components;
using Domain.Needs;
using Domain.Needs.Importance;
using Domain.Users;
using LanguageExt;
using MediatR;

namespace Application.Needs.Commands.Create
{
    public sealed class CreateNeedCommandHandler(
            INeedRepository needRepository,
            IComponentRepository componentRepository,
            ISender sender) 
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

                var componentOption = await componentRepository.GetByIdAsync(componentId, cancellationToken);
                if (componentOption.IsNone)
                    return new UnhandledNeedException(NeedId.Empty());

                var requestedBy = new UserId(request.RequestedBy);
                var importanceId = new NeedImportanceId(request.ImportanceId);

                var need = Need.Create(
                    componentId: componentId,
                    quantityNeeded: request.QuantityNeeded,
                    requestedBy: requestedBy,
                    description: request.Description,
                    importanceId: importanceId);

                needId = need.Id;

                var created = await needRepository.AddAsync(need, cancellationToken);

                var historyCommand = new CreateHistoryCommand
                {
                    UserId = request.PerformedBy,
                    ActionId = Guid.Parse("PUT-HERE-ActionId-GUID"),
                    EntityTypeId = Guid.Parse("PUT-HERE-EntityTypeId-GUID"),
                    EntityId = created.Id.Value.ToString(),
                    OldValues = null,
                    NewValues = $"Need for component {need.ComponentId.Value} " +
                                $"(quantity {need.QuantityNeeded}) created."
                };

                await sender.Send(historyCommand, cancellationToken);

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
