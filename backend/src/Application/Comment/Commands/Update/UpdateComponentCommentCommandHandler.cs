using Application.Common.Interfaces.Repositories;
using Application.Comment.Exceptions;
using Domain.Components.Comment;
using LanguageExt;
using MediatR;

namespace Application.Comment.Commands.Update
{
    public sealed class UpdateComponentCommentCommandHandler(
            IComponentCommentRepository commentRepository)
            : IRequestHandler<UpdateComponentCommentCommand, Either<ComponentCommentException, ComponentComment>>
    {
        public async Task<Either<ComponentCommentException, ComponentComment>> Handle(
            UpdateComponentCommentCommand request,
            CancellationToken cancellationToken)
        {
            var id = new ComponentCommentId(request.Id);
            var option = await commentRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: c => UpdateEntity(c, request, cancellationToken),
                None: () => Task.FromResult<Either<ComponentCommentException, ComponentComment>>(
                    new ComponentCommentNotFoundException(id)));
        }

        private async Task<Either<ComponentCommentException, ComponentComment>> UpdateEntity(
            ComponentComment comment,
            UpdateComponentCommentCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                comment.Update(request.Content);

                var updated = await commentRepository.UpdateAsync(comment, cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledComponentCommentException(comment.Id, ex);
            }
        }
    }
}
