using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.Schematics.Exceptions;
using Domain.Components;
using Domain.Schematics;
using Domain.Schematics.Schematics;
using Domain.Schematics.UsefulLink;
using Domain.Users;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Schematics.Commands.Create
{
    public sealed class CreateSchematicCommandHandler(
        ISchematicRepository schematicRepository,
        IComponentRepository componentRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<CreateSchematicCommand, Either<SchematicException, Schematic>>
    {
        public async Task<Either<SchematicException, Schematic>> Handle(
            CreateSchematicCommand request,
            CancellationToken cancellationToken)
        {
            SchematicId? schematicId = null;

            try
            {
                var componentId = new ComponentId(request.ComponentId);
                var componentOption = await componentRepository.GetByIdAsync(componentId, cancellationToken);
                if (componentOption.IsNone)
                {
                    return new SchematicNotFoundException(SchematicId.Empty());
                }

                var createdBy = new UserId(request.CreatedBy);

                SchematicUsefulLinkId? usefulLinkId = null;
                if (request.UsefulLinkId.HasValue)
                {
                    usefulLinkId = new SchematicUsefulLinkId(request.UsefulLinkId.Value);
                }

                var schematic = Schematic.Create(
                    componentId: componentId,
                    title: request.Title,
                    description: request.Description,
                    photoUrl: request.PhotoUrl,
                    documentUrl: request.DocumentUrl,
                    schematicUsefulLinkId: usefulLinkId,
                    createdBy: createdBy);

                schematicId = schematic.Id;

                var created = await schematicRepository.AddAsync(schematic, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    schematic.Id,
                    schematic.ComponentId,
                    schematic.Title,
                    schematic.Description,
                    schematic.PhotoUrl,
                    schematic.DocumentUrl,
                    schematic.SchematicUsefulLinkId,
                    schematic.CreatedAt
                });

                await historyObserver.EntityCreatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "Schematic",
                    entityId: schematic.Id.Value.ToString(),
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledSchematicException(
                    schematicId ?? SchematicId.Empty(),
                    ex);
            }
        }
    }
}
