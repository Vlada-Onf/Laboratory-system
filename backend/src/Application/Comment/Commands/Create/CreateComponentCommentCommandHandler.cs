using Application.Common.Interfaces.Repositories;
using Application.Comment.Exceptions;
using Domain.Components;
using Domain.Components.Comment;
using Domain.Users;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Comment.Commands.Create
{
    public sealed class CreateComponentCommentCommandHandler(
            IComponentCommentRepository commentRepository,
            IComponentRepository componentRepository)
            : IRequestHandler<CreateComponentCommentCommand, Either<ComponentCommentException, ComponentComment>>
    {
        public async Task<Either<ComponentCommentException, ComponentComment>> Handle(
            CreateComponentCommentCommand request,
            CancellationToken cancellationToken)
        {
            ComponentCommentId? id = null;

            try
            {
                var componentId = new ComponentId(request.ComponentId);

                var componentOption = await componentRepository.GetByIdAsync(componentId, cancellationToken);
                if (componentOption.IsNone)
                    return new UnhandledComponentCommentException(ComponentCommentId.Empty());

                var userId = new UserId(request.CreatedBy);

                var comment = ComponentComment.New(
                    componentId: componentId,
                    content: request.Content,
                    authorId: userId);

                id = comment.Id;

                var created = await commentRepository.AddAsync(comment, cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledComponentCommentException(
                    id ?? ComponentCommentId.Empty(),
                    ex);
            }
        }
    }
}
