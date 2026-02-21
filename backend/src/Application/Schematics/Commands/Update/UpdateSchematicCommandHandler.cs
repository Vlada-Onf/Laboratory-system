using Application.Common.Interfaces.Repositories;
using Application.Schematics.Exceptions;
using Domain.Schematics;
using Domain.Schematics.Schematics;
using Domain.Schematics.UsefulLink;
using Domain.Users;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

                schematic.Update(
                    title: request.Title,
                    description: request.Description,
                    photoUrl: request.PhotoUrl,
                    documentUrl: request.DocumentUrl,
                    schematicUsefulLinkId: new SchematicUsefulLinkId(request.UsefulLinkId),
                    updatedBy: updatedBy);

                var updated = await schematicRepository.UpdateAsync(schematic, cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledSchematicException(schematic.Id, ex);
            }
        }
    }
}
