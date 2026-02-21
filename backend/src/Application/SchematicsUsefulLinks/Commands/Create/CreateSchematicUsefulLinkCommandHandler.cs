using Application.Common.Interfaces.Repositories;
using Application.SchematicsUsefulLinks.Exceptions;
using Domain.Schematics.Schematics;
using Domain.Schematics.UsefulLink;
using Domain.Users;
using FluentValidation;
using LanguageExt;
using MediatR;

namespace Application.SchematicsUsefulLinks.Commands.Create
{
    public sealed class CreateSchematicUsefulLinkCommandHandler(
            ISchematicUsefulLinkRepository linkRepository)
            : IRequestHandler<CreateSchematicUsefulLinkCommand, Either<SchematicUsefulLinkException, SchematicUsefulLink>>
    {
        public async Task<Either<SchematicUsefulLinkException, SchematicUsefulLink>> Handle(
            CreateSchematicUsefulLinkCommand request,
            CancellationToken cancellationToken)
        {
            SchematicUsefulLinkId? id = null;

            try
            {
                var schematicId = new SchematicId(request.SchematicId);
                var createdBy = new UserId(request.CreatedBy);

                var link = SchematicUsefulLink.New(
                    schematicId: schematicId,
                    title: request.Title,
                    url: request.Url,
                    createdBy: createdBy);

                id = link.Id;

                var created = await linkRepository.AddAsync(link, cancellationToken);
                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledSchematicUsefulLinkException(
                    id ?? SchematicUsefulLinkId.Empty(),
                    ex);
            }
        }
    }
}
