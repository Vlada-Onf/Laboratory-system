using Application.Categories.Exceptions;
using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries.Commands.Create;
using Domain.Categories;
using LanguageExt;
using MediatR;

namespace Application.Categories.Commands.Delete
{
    public class DeleteCategoryCommandHandler(
        ICategoryRepository categoryRepository,
        IActionRepository actionRepository,
        IEntityTypeRepository entityTypeRepository,
        ISender sender)
        : IRequestHandler<DeleteCategoryCommand, Either<CategoryException, Category>>
    {
        public async Task<Either<CategoryException, Category>> Handle(
            DeleteCategoryCommand request,
            CancellationToken cancellationToken)
        {
            var categoryId = new CategoryId(request.Id);
            var option = await categoryRepository.GetByIdAsync(categoryId, cancellationToken);

            return await option.MatchAsync(
                Some: category => DeleteEntity(category, request.PerformedBy, cancellationToken),
                None: () => Task.FromResult<Either<CategoryException, Category>>(
                    new CategoryNotFoundException(categoryId)));
        }

        private async Task<Either<CategoryException, Category>> DeleteEntity(
            Category category,
            Guid performedBy,
            CancellationToken cancellationToken)
        {
            try
            {
                var oldValues =
                    $"Name={category.Name}, Description={category.Description}, " +
                    $"PhotoUrl={category.PhotoUrl}, CardColor={category.CardColor}";

                var deleted = await categoryRepository.DeleteAsync(category, cancellationToken);

                var actionOption = await actionRepository.GetByNameAsync(
                    "Delete category", cancellationToken);
                if (actionOption.IsNone)
                    throw new InvalidOperationException("Action 'Delete category' not found");
                var action = actionOption.First();

                var entityTypeOption = await entityTypeRepository.GetByNameAsync(
                    "Category", cancellationToken);
                if (entityTypeOption.IsNone)
                    throw new InvalidOperationException("EntityType 'Category' not found");
                var entityType = entityTypeOption.First();

                var historyCommand = new CreateHistoryCommand
                {
                    UserId = performedBy,
                    ActionId = action.Id.Value,
                    EntityTypeId = entityType.Id.Value,
                    EntityId = category.Id.Value.ToString(),
                    OldValues = oldValues,
                    NewValues = null
                };

                var historyResult = await sender.Send(historyCommand, cancellationToken);
                historyResult.IfLeft(e => throw e);

                return deleted;
            }
            catch (Exception exception)
            {
                return new UnhandledCategoryException(category.Id, exception);
            }
        }
    }
}
