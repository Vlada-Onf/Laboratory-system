using Application.Common.Interfaces.Repositories;
using Application.Schematics.Exceptions;
using Domain.Schematics;
using Domain.Schematics.Schematics;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Schematics.Commands.Delete
{
    public sealed class DeleteSchematicCommandHandler(
            ISchematicRepository schematicRepository)
            : IRequestHandler<DeleteSchematicCommand, Either<SchematicException, Schematic>>
    {
        public async Task<Either<SchematicException, Schematic>> Handle(
            DeleteSchematicCommand request,
            CancellationToken cancellationToken)
        {
            var id = new SchematicId(request.Id);
            var option = await schematicRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: s => DeleteEntity(s, cancellationToken),
                None: () => Task.FromResult<Either<SchematicException, Schematic>>(
                    new SchematicNotFoundException(id)));
        }

        private async Task<Either<SchematicException, Schematic>> DeleteEntity(
            Schematic schematic,
            CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await schematicRepository.DeleteAsync(schematic, cancellationToken);
                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledSchematicException(schematic.Id, ex);
            }
        }
    }
}
