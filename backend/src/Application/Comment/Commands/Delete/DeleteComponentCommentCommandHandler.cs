using Application.Common.Interfaces.Repositories;
using Application.Comment.Exceptions;
using Domain.Components.Comment;
using LanguageExt;
using MediatR;

namespace Application.Comment.Commands.Delete
{
    public sealed class DeleteComponentCommentCommandHandler(
            IComponentCommentRepository commentRepository)
            : IRequestHandler<DeleteComponentCommentCommand, Either<ComponentCommentException, ComponentComment>>
    {
        public async Task<Either<ComponentCommentException, ComponentComment>> Handle(
            DeleteComponentCommentCommand request,
            CancellationToken cancellationToken)
        {
            var id = new ComponentCommentId(request.Id);
            var option = await commentRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: c => DeleteEntity(c, cancellationToken),
                None: () => Task.FromResult<Either<ComponentCommentException, ComponentComment>>(
                    new ComponentCommentNotFoundException(id)));
        }

        private async Task<Either<ComponentCommentException, ComponentComment>> DeleteEntity(
            ComponentComment comment,
            CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await commentRepository.DeleteAsync(comment, cancellationToken);
                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledComponentCommentException(comment.Id, ex);
            }
        }
    }
}
