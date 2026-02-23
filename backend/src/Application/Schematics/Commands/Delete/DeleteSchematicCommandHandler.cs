using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.Schematics.Exceptions;
using Domain.Schematics;
using Domain.Schematics.Schematics;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Schematics.Commands.Delete
{
    public sealed class DeleteSchematicCommandHandler(
        ISchematicRepository schematicRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<DeleteSchematicCommand, Either<SchematicException, Schematic>>
    {
        public async Task<Either<SchematicException, Schematic>> Handle(
            DeleteSchematicCommand request,
            CancellationToken cancellationToken)
        {
            var id = new SchematicId(request.Id);
            var option = await schematicRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: s => DeleteEntity(s, request.PerformedBy, cancellationToken),
                None: () => Task.FromResult<Either<SchematicException, Schematic>>(
                    new SchematicNotFoundException(id)));
        }

        private async Task<Either<SchematicException, Schematic>> DeleteEntity(
            Schematic schematic,
            Guid performedBy,
            CancellationToken cancellationToken)
        {
            string oldValues;
            try
            {
                var safeSnapshot = new
                {
                    Id = schematic.Id.Value.ToString(),
                    ComponentId = schematic.ComponentId.Value.ToString(),
                    Title = schematic.Title ?? string.Empty,
                    Description = schematic.Description ?? string.Empty,
                    PhotoUrl = schematic.PhotoUrl ?? string.Empty,
                    DocumentUrl = schematic.DocumentUrl ?? string.Empty,
                    UsefulLinkId = schematic.SchematicUsefulLinkId?.Value.ToString() ?? string.Empty,
                    CreatedAt = schematic.CreatedAt,
                    UpdatedAt = schematic.UpdatedAt
                };

                oldValues = JsonSerializer.Serialize(safeSnapshot);
            }
            catch (Exception ex)
            {
                oldValues = $"\"SerializationFailed: {ex.GetType().Name}\"";
            }

            Schematic? deletedEntity;
            try
            {
                deletedEntity = await schematicRepository.DeleteAsync(schematic, cancellationToken);
            }
            catch (Exception ex)
            {
                return new UnhandledSchematicException(schematic.Id, ex);
            }

            try
            {
                await historyObserver.EntityDeletedAsync(
                    userId: performedBy,
                    entityTypeName: "Schematic",
                    entityId: schematic.Id.Value.ToString(),
                    oldValues: oldValues,
                    cancellationToken: cancellationToken);
            }
            catch (Exception exeption)
            {
                return new UnhandledSchematicException(schematic.Id, exeption);
            }

            return deletedEntity!;
        }
    }
}
