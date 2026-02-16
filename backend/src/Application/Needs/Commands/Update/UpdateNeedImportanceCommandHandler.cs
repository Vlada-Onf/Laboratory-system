using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries.Commands.Create;
using Application.Needs.Exceptions;
using Domain.Needs;
using Domain.Needs.Importance;
using LanguageExt;
using MediatR;

namespace Application.Needs.Commands.Update
{
    public sealed class UpdateNeedImportanceCommandHandler(
        INeedRepository needRepository,
        ISender sender)
        : IRequestHandler<UpdateNeedImportanceCommand, Either<NeedException, Need>>
    {
        public async Task<Either<NeedException, Need>> Handle(
            UpdateNeedImportanceCommand request,
            CancellationToken cancellationToken)
        {
            var needId = new NeedId(request.Id);
            var option = await needRepository.GetByIdAsync(needId, cancellationToken);

            return await option.MatchAsync(
                Some: need => UpdateEntity(need, request, cancellationToken),
                None: () => Task.FromResult<Either<NeedException, Need>>(
                    new NeedNotFoundException(needId)));
        }

        private async Task<Either<NeedException, Need>> UpdateEntity(
            Need need,
            UpdateNeedImportanceCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                var oldImportanceId = need.ImportanceId;
                var importanceId = new NeedImportanceId(request.ImportanceId);

                need.UpdateImportance(importanceId);

                var updated = await needRepository.UpdateAsync(need, cancellationToken);

                var historyCommand = new CreateHistoryCommand
                {
                    UserId = request.PerformedBy,
                    ActionId = Guid.Parse("PUT-HERE-ActionId-UPDATE-NEED-IMPORTANCE"),
                    EntityTypeId = Guid.Parse("PUT-HERE-EntityTypeId-NEED"),
                    EntityId = need.Id.Value.ToString(),
                    OldValues = $"ImportanceId={oldImportanceId.Value}",
                    NewValues = $"ImportanceId={need.ImportanceId.Value}"
                };

                await sender.Send(historyCommand, cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedException(need.Id, ex);
            }
        }
    }
}
