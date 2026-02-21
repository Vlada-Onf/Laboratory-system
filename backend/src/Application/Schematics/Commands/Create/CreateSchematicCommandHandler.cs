using Application.Common.Interfaces.Repositories;
using Application.Schematics.Exceptions;
using Domain.Components;
using Domain.Schematics;
using Domain.Schematics.Schematics;
using Domain.Schematics.UsefulLink;
using Domain.Users;
using LanguageExt;
using MediatR;

namespace Application.Schematics.Commands.Create
{
    public sealed class CreateSchematicCommandHandler(
        ISchematicRepository schematicRepository,
        IComponentRepository componentRepository)
        : IRequestHandler<CreateSchematicCommand, Either<SchematicException, Schematic>>
    {
        public async Task<Either<SchematicException, Schematic>> Handle(
            CreateSchematicCommand request,
            CancellationToken cancellationToken)
        {
            Console.WriteLine(
                $"[CreateSchematic] START " +
                $"ComponentId={request.ComponentId}, " +
                $"Title={request.Title}, " +
                $"CreatedBy={request.CreatedBy}, " +
                $"UsefulLinkId={request.UsefulLinkId}, " +
                $"PhotoUrl={request.PhotoUrl}, " +
                $"DocumentUrl={request.DocumentUrl}");

            SchematicId? id = null;

            try
            {
                var componentId = new ComponentId(request.ComponentId);
                Console.WriteLine("[CreateSchematic] ComponentId created");

                var componentOption = await componentRepository.GetByIdAsync(componentId, cancellationToken);
                if (componentOption.IsNone)
                {
                    Console.WriteLine("[CreateSchematic] Component not found");
                    return new UnhandledSchematicException(SchematicId.Empty());
                }

                var createdBy = new UserId(request.CreatedBy);
                Console.WriteLine("[CreateSchematic] UserId created");

                SchematicUsefulLinkId? usefulLinkId = null;
                if (request.UsefulLinkId.HasValue)
                {
                    usefulLinkId = new SchematicUsefulLinkId(request.UsefulLinkId.Value);
                    Console.WriteLine("[CreateSchematic] UsefulLinkId created");
                }
                else
                {
                    Console.WriteLine("[CreateSchematic] UsefulLinkId is null");
                }

                var schematic = Schematic.Create(
                    componentId: componentId,
                    title: request.Title,
                    description: request.Description,
                    photoUrl: request.PhotoUrl,
                    documentUrl: request.DocumentUrl,
                    schematicUsefulLinkId: usefulLinkId,
                    createdBy: createdBy);

                Console.WriteLine("[CreateSchematic] Schematic.Create OK");

                id = schematic.Id;

                var created = await schematicRepository.AddAsync(schematic, cancellationToken);
                Console.WriteLine($"[CreateSchematic] Repository.AddAsync OK. New Id={schematic.Id.Value}");

                return created;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CreateSchematic] ERROR: {ex.Message}");
                Console.WriteLine(ex.StackTrace);

                return new UnhandledSchematicException(
                    id ?? SchematicId.Empty(),
                    ex);
            }
        }
    }
}
