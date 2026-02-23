using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.SchematicsUsefulLinks.Exceptions;
using Domain.Schematics.UsefulLink;
using Domain.Users;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.SchematicsUsefulLinks.Commands.Update
{
    public sealed class UpdateSchematicUsefulLinkCommandHandler(
        ISchematicUsefulLinkRepository linkRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<UpdateSchematicUsefulLinkCommand, Either<SchematicUsefulLinkException, SchematicUsefulLink>>
    {
        public async Task<Either<SchematicUsefulLinkException, SchematicUsefulLink>> Handle(
            UpdateSchematicUsefulLinkCommand request,
            CancellationToken cancellationToken)
        {
            var id = new SchematicUsefulLinkId(request.Id);
            var option = await linkRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: link => UpdateEntity(link, request, cancellationToken),
                None: () => Task.FromResult<Either<SchematicUsefulLinkException, SchematicUsefulLink>>(
                    new SchematicUsefulLinkNotFoundException(id)));
        }

        private async Task<Either<SchematicUsefulLinkException, SchematicUsefulLink>> UpdateEntity(
            SchematicUsefulLink link,
            UpdateSchematicUsefulLinkCommand request,
            CancellationToken ct)
        {
            try
            {
                var updatedBy = new UserId(request.UpdatedBy);

                var oldValues = JsonSerializer.Serialize(new
                {
                    link.Id,
                    link.SchematicId,
                    link.Title,
                    link.Url,
                    link.CreatedAt,
                    link.LastUpdatedAt
                });

                link.Update(request.Title, request.Url, updatedBy);

                var updated = await linkRepository.UpdateAsync(link, ct);

                var newValues = JsonSerializer.Serialize(new
                {
                    link.Id,
                    link.SchematicId,
                    link.Title,
                    link.Url,
                    link.CreatedAt,
                    link.LastUpdatedAt
                });

                await historyObserver.EntityUpdatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "SchematicUsefulLink",
                    entityId: link.Id.Value.ToString(),
                    oldValues: oldValues,
                    newValues: newValues,
                    cancellationToken: ct);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledSchematicUsefulLinkException(link.Id, ex);
            }
        }
    }
}
