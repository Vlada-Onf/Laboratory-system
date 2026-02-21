using Application.Common.Interfaces.Repositories;
using Application.Schematics.Exceptions;
using Domain.Components;
using Domain.Schematics;
using Domain.Schematics.Schematics;
using Domain.Users;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
            SchematicId? id = null;

            try
            {
                var componentId = new ComponentId(request.ComponentId);

                var componentOption = await componentRepository.GetByIdAsync(componentId, cancellationToken);
                if (componentOption.IsNone)
                    return new UnhandledSchematicException(SchematicId.Empty());

                var createdBy = new UserId(request.CreatedBy);

                var schematic = Schematic.Create(
                    componentId: componentId,
                    title: request.Title,
                    description: request.Description,
                    photoUrl: request.PhotoUrl,
                    documentUrl: request.DocumentUrl,
                    additionalLinks: request.AdditionalLinks,
                    createdBy: createdBy);

                id = schematic.Id;

                var created = await schematicRepository.AddAsync(schematic, cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledSchematicException(
                    id ?? SchematicId.Empty(),
                    ex);
            }
        }
    }
}
