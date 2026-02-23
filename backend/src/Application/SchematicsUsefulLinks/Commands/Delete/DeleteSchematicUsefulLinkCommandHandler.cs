using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.SchematicsUsefulLinks.Exceptions;
using Domain.Schematics.UsefulLink;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.SchematicsUsefulLinks.Commands.Delete
{
    public sealed class DeleteSchematicUsefulLinkCommandHandler(
        ISchematicUsefulLinkRepository linkRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<DeleteSchematicUsefulLinkCommand, Either<SchematicUsefulLinkException, SchematicUsefulLink>>
    {
        public async Task<Either<SchematicUsefulLinkException, SchematicUsefulLink>> Handle(
            DeleteSchematicUsefulLinkCommand request,
            CancellationToken cancellationToken)
        {
            var id = new SchematicUsefulLinkId(request.Id);
            var option = await linkRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: link => DeleteEntity(link, request, cancellationToken),
                None: () => Task.FromResult<Either<SchematicUsefulLinkException, SchematicUsefulLink>>(
                    new SchematicUsefulLinkNotFoundException(id)));
        }

        private async Task<Either<SchematicUsefulLinkException, SchematicUsefulLink>> DeleteEntity(
            SchematicUsefulLink link,
            DeleteSchematicUsefulLinkCommand request,
            CancellationToken ct)
        {
            try
            {
                var oldValues = JsonSerializer.Serialize(new
                {
                    link.Id,
                    link.SchematicId,
                    link.Title,
                    link.Url,
                    link.CreatedAt,
                    link.LastUpdatedAt
                });

                var deleted = await linkRepository.DeleteAsync(link, ct);

                await historyObserver.EntityDeletedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "SchematicUsefulLink",
                    entityId: link.Id.Value.ToString(),
                    oldValues: oldValues,
                    cancellationToken: ct);

                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledSchematicUsefulLinkException(link.Id, ex);
            }
        }
    }
}
