using Application.Common.Interfaces.Repositories;
using Application.Schematics.Exceptions;
using Domain.Schematics;
using Domain.Schematics.Schematics;
using Domain.Schematics.UsefulLink;
using Domain.Users;
using LanguageExt;
using MediatR;

namespace Application.Schematics.Commands.Update
{
    public sealed class UpdateSchematicCommandHandler(
        ISchematicRepository schematicRepository)
        : IRequestHandler<UpdateSchematicCommand, Either<SchematicException, Schematic>>
    {
        public async Task<Either<SchematicException, Schematic>> Handle(
            UpdateSchematicCommand request,
            CancellationToken cancellationToken)
        {
            Console.WriteLine(
                $"[UpdateSchematic] START Id={request.Id}, " +
                $"Title={request.Title}, " +
                $"UpdatedBy={request.UpdatedBy}, " +
                $"UsefulLinkId={request.UsefulLinkId}, " +
                $"PhotoUrl={request.PhotoUrl}, " +
                $"DocumentUrl={request.DocumentUrl}");

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
                Console.WriteLine("[UpdateSchematic] UserId created");

                SchematicUsefulLinkId? usefulLinkId = null;
                if (request.UsefulLinkId.HasValue)
                {
                    usefulLinkId = new SchematicUsefulLinkId(request.UsefulLinkId.Value);
                    Console.WriteLine("[UpdateSchematic] UsefulLinkId created");
                }
                else
                {
                    Console.WriteLine("[UpdateSchematic] UsefulLinkId is null");
                }

                schematic.Update(
                    title: request.Title,
                    description: request.Description,
                    photoUrl: request.PhotoUrl,
                    documentUrl: request.DocumentUrl,
                    schematicUsefulLinkId: usefulLinkId,
                    updatedBy: updatedBy);

                Console.WriteLine("[UpdateSchematic] schematic.Update OK");

                var updated = await schematicRepository.UpdateAsync(schematic, cancellationToken);
                Console.WriteLine("[UpdateSchematic] Repository.UpdateAsync OK");

                return updated;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[UpdateSchematic] ERROR: {ex.Message}");
                Console.WriteLine(ex.StackTrace);

                return new UnhandledSchematicException(schematic.Id, ex);
            }
        }
    }
}
