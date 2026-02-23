using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.Tags.Exceptions;
using Domain.Tags;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Tags.Commands.Delete
{
    public class DeleteTagCommandHandler(
        ITagRepository tagRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<DeleteTagCommand, Either<TagException, Tag>>
    {
        public async Task<Either<TagException, Tag>> Handle(
            DeleteTagCommand request,
            CancellationToken cancellationToken)
        {
            var tagId = new TagId(request.Id);
            var option = await tagRepository.GetByIdAsync(tagId, cancellationToken);

            return await option.MatchAsync(
                Some: tag => DeleteEntity(tag, request.PerformedBy, cancellationToken),
                None: () => Task.FromResult<Either<TagException, Tag>>(
                    new TagNotFoundException(tagId)));
        }

        private async Task<Either<TagException, Tag>> DeleteEntity(
            Tag tag,
            Guid performedBy,
            CancellationToken cancellationToken)
        {
            try
            {
                var oldValues = JsonSerializer.Serialize(new
                {
                    tag.Id,
                    tag.Name,
                    tag.Color
                });

                var deleted = await tagRepository.DeleteAsync(tag, cancellationToken);

                await historyObserver.EntityDeletedAsync(
                    userId: performedBy,
                    entityTypeName: "Tag",
                    entityId: tag.Id.Value.ToString(),
                    oldValues: oldValues,
                    cancellationToken: cancellationToken);

                return deleted;
            }
            catch (Exception exception)
            {
                return new UnhandledTagException(tag.Id, exception);
            }
        }
    }
}
