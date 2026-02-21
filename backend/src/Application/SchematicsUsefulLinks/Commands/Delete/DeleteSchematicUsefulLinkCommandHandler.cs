using Application.Common.Interfaces.Repositories;
using Application.SchematicsUsefulLinks.Exceptions;
using Domain.Schematics.UsefulLink;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.SchematicsUsefulLinks.Commands.Delete
{
    public sealed class DeleteSchematicUsefulLinkCommandHandler(
            ISchematicUsefulLinkRepository linkRepository)
            : IRequestHandler<DeleteSchematicUsefulLinkCommand, Either<SchematicUsefulLinkException, SchematicUsefulLink>>
    {
        public async Task<Either<SchematicUsefulLinkException, SchematicUsefulLink>> Handle(
            DeleteSchematicUsefulLinkCommand request,
            CancellationToken cancellationToken)
        {
            var id = new SchematicUsefulLinkId(request.Id);
            var option = await linkRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: link => DeleteEntity(link, cancellationToken),
                None: () => Task.FromResult<Either<SchematicUsefulLinkException, SchematicUsefulLink>>(
                    new SchematicUsefulLinkNotFoundException(id)));
        }

        private async Task<Either<SchematicUsefulLinkException, SchematicUsefulLink>> DeleteEntity(
            SchematicUsefulLink link,
            CancellationToken ct)
        {
            try
            {
                var deleted = await linkRepository.DeleteAsync(link, ct);
                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledSchematicUsefulLinkException(link.Id, ex);
            }
        }
    }
}
