using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.NeedsImportance.Exceptions;
using Domain.Needs.Importance;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Application.NeedsImportance.Commands.Delete
{
    public sealed class DeleteNeedImportanceCommandHandler(
            INeedImportanceRepository importanceRepository,
            IHistoryObserver historyObserver)
            : IRequestHandler<DeleteNeedImportanceCommand, Either<NeedImportanceException, NeedImportance>>
    {
        public async Task<Either<NeedImportanceException, NeedImportance>> Handle(
            DeleteNeedImportanceCommand request,
            CancellationToken cancellationToken)
        {
            var id = new NeedImportanceId(request.Id);
            var option = await importanceRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: importance => DeleteEntity(importance, request.PerformedBy, cancellationToken),
                None: () => Task.FromResult<Either<NeedImportanceException, NeedImportance>>(
                    new NeedImportanceNotFoundException(id)));
        }

        private async Task<Either<NeedImportanceException, NeedImportance>> DeleteEntity(
            NeedImportance importance,
            Guid performedBy,
            CancellationToken cancellationToken)
        {
            try
            {
                var oldValues = JsonSerializer.Serialize(new
                {
                    importance.Id,
                    importance.Name,
                    importance.Level,
                    importance.CreatedAt
                });

                var deleted = await importanceRepository.DeleteAsync(importance, cancellationToken);

                await historyObserver.EntityDeletedAsync(
                    userId: performedBy,
                    entityTypeName: "NeedImportance",
                    entityId: importance.Id.Value.ToString(),
                    oldValues: oldValues,
                    cancellationToken: cancellationToken);

                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedImportanceException(importance.Id, ex);
            }
        }
    }
}