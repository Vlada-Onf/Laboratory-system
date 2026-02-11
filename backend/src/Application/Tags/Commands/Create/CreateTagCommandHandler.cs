using Application.Common.Interfaces.Repositories;
using Application.Tags.Exceptions;
using Domain.Tags;
using Domain.Users;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Tags.Commands.Create
{
    public class CreateTagCommandHandler(
        ITagRepository tagRepository)
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