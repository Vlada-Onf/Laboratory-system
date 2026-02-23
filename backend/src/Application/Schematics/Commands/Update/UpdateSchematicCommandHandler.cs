using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.Schematics.Exceptions;
using Domain.Schematics;
using Domain.Schematics.Schematics;
using Domain.Schematics.UsefulLink;
using Domain.Users;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Schematics.Commands.Update
{
    public sealed class UpdateSchematicCommandHandler(
        ISchematicRepository schematicRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<UpdateSchematicCommand, Either<SchematicException, Schematic>>
    {
        public async Task<Either<SchematicException, Schematic>> Handle(
            UpdateSchematicCommand request,
            CancellationToken cancellationToken)
        {
            var id = new SchematicId(request.Id);
            var option = await schematicRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: s => UpdateEntity(s, request, cancellationToken),
                None: () => Task.FromResult<Either<SchematicException, Schematic>>(
                    new SchematicNotFoundException(id)));
        }

        private async Task<Either<SchematicException, Schematic>> UpdateEntity(
            Schematic schematic,
            UpdateSchematicCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                var updatedBy = new UserId(request.UpdatedBy);

                var oldValues = JsonSerializer.Serialize(new
                {
                    schematic.Id,
                    schematic.ComponentId,
                    schematic.Title,
                    schematic.Description,
                    schematic.PhotoUrl,
                    schematic.DocumentUrl,
                    schematic.SchematicUsefulLinkId,
                    schematic.CreatedAt,
                    schematic.UpdatedAt
                });

                SchematicUsefulLinkId? usefulLinkId = null;
                if (request.UsefulLinkId.HasValue)
                {
                    usefulLinkId = new SchematicUsefulLinkId(request.UsefulLinkId.Value);
                }

                schematic.Update(
                    title: request.Title,
                    description: request.Description,
                    photoUrl: request.PhotoUrl,
                    documentUrl: request.DocumentUrl,
                    schematicUsefulLinkId: usefulLinkId,
                    updatedBy: updatedBy);

                var updated = await schematicRepository.UpdateAsync(schematic, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    schematic.Id,
                    schematic.ComponentId,
                    schematic.Title,
                    schematic.Description,
                    schematic.PhotoUrl,
                    schematic.DocumentUrl,
                    schematic.SchematicUsefulLinkId,
                    schematic.CreatedAt,
                    schematic.UpdatedAt
                });

                await historyObserver.EntityUpdatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "Schematic",
                    entityId: schematic.Id.Value.ToString(),
                    oldValues: oldValues,
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledSchematicException(schematic.Id, ex);
            }
        }
    }
}
