using Application.Common.Interfaces.Repositories;
using Application.SchematicsUsefulLinks.Exceptions;
using Domain.Schematics.UsefulLink;
using Domain.Users;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.SchematicsUsefulLinks.Commands.Update
{
    public sealed class UpdateSchematicUsefulLinkCommandHandler(
            ISchematicUsefulLinkRepository linkRepository)
            : IRequestHandler<UpdateSchematicUsefulLinkCommand, Either<SchematicUsefulLinkException, SchematicUsefulLink>>
    {
        public async Task<Either<SchematicUsefulLinkException, SchematicUsefulLink>> Handle(
            UpdateSchematicUsefulLinkCommand request,
            CancellationToken cancellationToken)
        {
            var id = new SchematicUsefulLinkId(request.Id);
            var option = await linkRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: link => UpdateEntity(link, request, cancellationToken),
                None: () => Task.FromResult<Either<SchematicUsefulLinkException, SchematicUsefulLink>>(
                    new SchematicUsefulLinkNotFoundException(id)));
        }

        private async Task<Either<SchematicUsefulLinkException, SchematicUsefulLink>> UpdateEntity(
            SchematicUsefulLink link,
            UpdateSchematicUsefulLinkCommand request,
            CancellationToken ct)
        {
            try
            {
                var updatedBy = new UserId(request.UpdatedBy);
                link.Update(request.Title, request.Url, updatedBy);

                var updated = await linkRepository.UpdateAsync(link, ct);
                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledSchematicUsefulLinkException(link.Id, ex);
            }
        }
    }
}
