using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.SchematicsUsefulLinks.Exceptions;
using Domain.Schematics.Schematics;
using Domain.Schematics.UsefulLink;
using Domain.Users;
using FluentValidation;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.SchematicsUsefulLinks.Commands.Create
{
    public sealed class CreateSchematicUsefulLinkCommandHandler(
            ISchematicUsefulLinkRepository linkRepository,
            ISchematicRepository schematicRepository,
            IHistoryObserver historyObserver)
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
                var schematicOption = await schematicRepository.GetByIdAsync(schematicId, cancellationToken);
                if (schematicOption.IsNone)
                {
                    return new SchematicUsefulLinkNotFoundException(SchematicUsefulLinkId.Empty());
                }

                var createdBy = new UserId(request.CreatedBy);

                var link = SchematicUsefulLink.New(
                    schematicId: schematicId,
                    title: request.Title,
                    url: request.Url,
                    createdBy: createdBy);

                id = link.Id;

                var created = await linkRepository.AddAsync(link, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    link.Id,
                    link.SchematicId,
                    link.Title,
                    link.Url,
                    link.CreatedAt
                });

                await historyObserver.EntityCreatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "SchematicUsefulLink",
                    entityId: link.Id.Value.ToString(),
                    newValues: newValues,
                    cancellationToken: cancellationToken);

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
