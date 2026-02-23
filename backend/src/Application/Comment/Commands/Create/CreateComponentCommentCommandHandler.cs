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
            Console.WriteLine("[CreateComment] START");
            Console.WriteLine($"[CreateComment] ComponentId={request.ComponentId}");
            Console.WriteLine($"[CreateComment] Content='{request.Content}'");
            Console.WriteLine($"[CreateComment] CreatedBy={request.CreatedBy}");
            Console.WriteLine($"[CreateComment] PerformedBy={request.PerformedBy}");

            ComponentCommentId? id = null;

            try
            {
                var componentId = new ComponentId(request.ComponentId);
                Console.WriteLine("[CreateComment] ComponentId created");

                var componentOption = await componentRepository.GetByIdAsync(componentId, cancellationToken);
                Console.WriteLine($"[CreateComment] Component found: {componentOption.IsSome}");

                if (componentOption.IsNone)
                {
                    Console.WriteLine("[CreateComment] Component not found");
                    return new UnhandledComponentCommentException(ComponentCommentId.Empty());
                }

                var userId = new UserId(request.CreatedBy);
                Console.WriteLine("[CreateComment] UserId created");

                var comment = ComponentComment.New(
                    componentId: componentId,
                    content: request.Content,
                    authorId: userId);
                Console.WriteLine("[CreateComment] ComponentComment.New OK");

                id = comment.Id;

                var created = await commentRepository.AddAsync(comment, cancellationToken);
                Console.WriteLine("[CreateComment] Repository.AddAsync OK");

                var newValues = JsonSerializer.Serialize(new
                {
                    comment.Id,
                    comment.ComponentId,
                    comment.CreatedBy,
                    comment.Content,
                    comment.CreatedAt
                });
                Console.WriteLine("[CreateComment] History payload serialized OK");
                Console.WriteLine($"[CreateComment] History payload: {newValues}");

                await historyObserver.EntityCreatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "ComponentComment",
                    entityId: comment.Id.Value.ToString(),
                    newValues: newValues,
                    cancellationToken: cancellationToken);
                Console.WriteLine("[CreateComment] History recorded OK");

                Console.WriteLine("[CreateComment] SUCCESS");
                return created;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CreateComment] ERROR {ex.GetType().Name}: {ex.Message}");
                Console.WriteLine(ex.StackTrace);

                return new UnhandledComponentCommentException(
                    id ?? ComponentCommentId.Empty(),
                    ex);
            }
        }
    }
}
