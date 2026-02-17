using Application.Categories.Exceptions;
using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries.Commands.Create;
using Domain.Categories;
using Domain.Users;
using LanguageExt;
using MediatR;

namespace Application.Categories.Commands.Update
{
    public class UpdateCategoryCommandHandler(
        ICategoryRepository categoryRepository,
        IActionRepository actionRepository,
        IEntityTypeRepository entityTypeRepository,
        ISender sender)
        : IRequestHandler<UpdateCategoryCommand, Either<CategoryException, Category>>
    {
        public async Task<Either<CategoryException, Category>> Handle(
            UpdateCategoryCommand request,
            CancellationToken cancellationToken)
        {
            var categoryId = new CategoryId(request.Id);
            var option = await categoryRepository.GetByIdAsync(categoryId, cancellationToken);

            return await option.MatchAsync(
                Some: category => UpdateEntity(category, request, cancellationToken),
                None: () => Task.FromResult<Either<CategoryException, Category>>(
                    new CategoryNotFoundException(categoryId)));
        }

        private async Task<Either<CategoryException, Category>> UpdateEntity(
            Category category,
            UpdateCategoryCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                var oldName = category.Name;
                var oldDescription = category.Description;
                var oldPhotoUrl = category.PhotoUrl;
                var oldCardColor = category.CardColor;

                var lastUpdatedBy = new UserId(request.LastUpdatedBy);

                category.Update(
                    name: request.Name,
                    description: request.Description,
                    photoUrl: request.PhotoUrl,
                    cardColor: request.CardColor,
                    lastUpdatedBy: lastUpdatedBy);

                var updated = await categoryRepository.UpdateAsync(category, cancellationToken);

                var actionOption = await actionRepository.GetByNameAsync(
                    "Update category", cancellationToken);
                if (actionOption.IsNone)
                    throw new InvalidOperationException("Action 'Update category' not found");
                var action = actionOption.First();

                var entityTypeOption = await entityTypeRepository.GetByNameAsync(
                    "Category", cancellationToken);
                if (entityTypeOption.IsNone)
                    throw new InvalidOperationException("EntityType 'Category' not found");
                var entityType = entityTypeOption.First();

                var historyCommand = new CreateHistoryCommand
                {
                    UserId = request.PerformedBy,
                    ActionId = action.Id.Value,
                    EntityTypeId = entityType.Id.Value,
                    EntityId = category.Id.Value.ToString(),
                    OldValues =
                        $"Name={oldName}, Description={oldDescription}, " +
                        $"PhotoUrl={oldPhotoUrl}, CardColor={oldCardColor}",
                    NewValues =
                        $"Name={category.Name}, Description={category.Description}, " +
                        $"PhotoUrl={category.PhotoUrl}, CardColor={category.CardColor}"
                };

                var historyResult = await sender.Send(historyCommand, cancellationToken);
                historyResult.IfLeft(e => throw e);

                return updated;
            }
            catch (Exception exception)
            {
                return new UnhandledCategoryException(category.Id, exception);
            }
        }
    }
}
