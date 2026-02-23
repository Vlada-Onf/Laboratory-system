using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.Tags.Exceptions;
using Domain.Tags;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Tags.Commands.Update
{
    public class UpdateTagCommandHandler(
        ITagRepository tagRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<UpdateTagCommand, Either<TagException, Tag>>
    {
        public async Task<Either<TagException, Tag>> Handle(
            UpdateTagCommand request,
            CancellationToken cancellationToken)
        {
            var tagId = new TagId(request.Id);
            var option = await tagRepository.GetByIdAsync(tagId, cancellationToken);

            return await option.MatchAsync(
                Some: tag => UpdateEntity(tag, request, cancellationToken),
                None: () => Task.FromResult<Either<TagException, Tag>>(
                    new TagNotFoundException(tagId)));
        }

        private async Task<Either<TagException, Tag>> UpdateEntity(
            Tag tag,
            UpdateTagCommand request,
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

                tag.Rename(request.Name);
                tag.ChangeColor(request.Color);

                var updated = await tagRepository.UpdateAsync(tag, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    tag.Id,
                    tag.Name,
                    tag.Color
                });

                await historyObserver.EntityUpdatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "Tag",
                    entityId: tag.Id.Value.ToString(),
                    oldValues: oldValues,
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return updated;
            }
            catch (Exception exception)
            {
                return new UnhandledTagException(tag.Id, exception);
            }
        }
    }
}
