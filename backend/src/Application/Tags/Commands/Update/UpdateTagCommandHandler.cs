using Application.Common.Interfaces.Repositories;
using Application.Tags.Exceptions;
using Domain.Tags;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Tags.Commands.Update
{
    public class UpdateTagCommandHandler(
         ITagRepository tagRepository)
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
                tag.Rename(request.Name);
                tag.ChangeColor(request.Color);

                var updated = await tagRepository.UpdateAsync(tag, cancellationToken);

                return updated;
            }
            catch (Exception exception)
            {
                return new UnhandledTagException(tag.Id, exception);
            }
        }
    }
}