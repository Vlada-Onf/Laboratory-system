using Application.Common.Interfaces.Repositories;
using Application.Comment.Exceptions;
using Application.HistoryEntries;
using Domain.Components;
using Domain.Components.Comment;
using Domain.Users;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Comment.Commands.Create
{
    public sealed class CreateComponentCommentCommandHandler(
        IComponentCommentRepository commentRepository,
        IComponentRepository componentRepository,
        IHistoryObserver historyObserver)
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
                {
                    return new UnhandledComponentCommentException(ComponentCommentId.Empty());
                }

                var userId = new UserId(request.CreatedBy);

                var comment = ComponentComment.New(
                    componentId: componentId,
                    content: request.Content,
                    authorId: userId);

                id = comment.Id;

                var created = await commentRepository.AddAsync(comment, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    comment.Id,
                    comment.ComponentId,
                    comment.CreatedBy,
                    comment.Content,
                    comment.CreatedAt
                });


                await historyObserver.EntityCreatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "Comment",
                    entityId: comment.Id.Value.ToString(),
                    newValues: newValues,
                    cancellationToken: cancellationToken);
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
