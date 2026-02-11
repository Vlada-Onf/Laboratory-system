using Application.Common.Interfaces.Repositories;
using Application.Tags.Exceptions;
using Domain.Tags;
using LanguageExt;
using MediatR;

namespace Application.Tags.Commands.Delete
{
    public class DeleteTagCommandHandler(
        ITagRepository tagRepository)
        : IRequestHandler<DeleteTagCommand, Either<TagException, Tag>>
    {
        public async Task<Either<TagException, Tag>> Handle(
            DeleteTagCommand request,
            CancellationToken cancellationToken)
        {
            var tagId = new TagId(request.Id);
            var option = await tagRepository.GetByIdAsync(tagId, cancellationToken);

            return await option.MatchAsync(
                Some: tag => DeleteEntity(tag, cancellationToken),
                None: () => Task.FromResult<Either<TagException, Tag>>(
                    new TagNotFoundException(tagId)));
        }

        private async Task<Either<TagException, Tag>> DeleteEntity(
            Tag tag,
            CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await tagRepository.DeleteAsync(tag, cancellationToken);
                return deleted;
            }
            catch (Exception exception)
            {
                return new UnhandledTagException(tag.Id, exception);
            }
        }
    }
}