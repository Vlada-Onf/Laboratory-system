using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.Tags.Exceptions;
using Domain.Tags;
using Domain.Users;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Tags.Commands.Create
{
    public class CreateTagCommandHandler(
        ITagRepository tagRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<CreateTagCommand, Either<TagException, Tag>>
    {
        public async Task<Either<TagException, Tag>> Handle(
            CreateTagCommand request,
            CancellationToken cancellationToken)
        {
            return await CreateEntity(request, cancellationToken);
        }

        private async Task<Either<TagException, Tag>> CreateEntity(
            CreateTagCommand request,
            CancellationToken cancellationToken)
        {
            TagId? tagId = null;

            try
            {
                var createdBy = new UserId(request.CreatedBy);

                var tag = Tag.Create(
                    name: request.Name,
                    color: request.Color,
                    createdBy: createdBy);

                tagId = tag.Id;

                var created = await tagRepository.AddAsync(tag, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    tag.Id,
                    tag.Name,
                    tag.Color
                });

                await historyObserver.EntityCreatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "Tag",
                    entityId: tag.Id.Value.ToString(),
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return created;
            }
            catch (Exception exception)
            {
                return new UnhandledTagException(
                    tagId ?? TagId.Empty(),
                    exception);
            }
        }
    }
}
