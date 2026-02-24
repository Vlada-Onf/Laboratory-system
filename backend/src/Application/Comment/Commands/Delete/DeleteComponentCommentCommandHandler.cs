using Application.Common.Interfaces.Repositories;
using Application.Comment.Exceptions;
using Application.HistoryEntries;
using Domain.Components.Comment;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Comment.Commands.Delete
{
    public sealed class DeleteComponentCommentCommandHandler(
        IComponentCommentRepository commentRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<DeleteComponentCommentCommand, Either<ComponentCommentException, ComponentComment>>
    {
        public async Task<Either<ComponentCommentException, ComponentComment>> Handle(
            DeleteComponentCommentCommand request,
            CancellationToken cancellationToken)
        {
            var id = new ComponentCommentId(request.Id);
            var option = await commentRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: c => DeleteEntity(c, request.PerformedBy, cancellationToken),
                None: () => Task.FromResult<Either<ComponentCommentException, ComponentComment>>(
                    new ComponentCommentNotFoundException(id)));
        }

        private async Task<Either<ComponentCommentException, ComponentComment>> DeleteEntity(
            ComponentComment comment,
            Guid performedBy,
            CancellationToken cancellationToken)
        {
            try
            {
                var oldValues = JsonSerializer.Serialize(new
                {
                    comment.Id,
                    comment.ComponentId,
                    comment.CreatedBy,
                    comment.Content,
                    comment.CreatedAt
                });

                var deleted = await commentRepository.DeleteAsync(comment, cancellationToken);

                await historyObserver.EntityDeletedAsync(
                    userId: performedBy,
                    entityTypeName: "Comment",
                    entityId: comment.Id.Value.ToString(),
                    oldValues: oldValues,
                    cancellationToken: cancellationToken);

                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledComponentCommentException(comment.Id, ex);
            }
        }
    }
}
