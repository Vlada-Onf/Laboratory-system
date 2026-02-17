using Application.Categories.Exceptions;
using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries.Commands.Create;
using Domain.Categories;
using Domain.Users;
using LanguageExt;
using MediatR;

namespace Application.Categories.Commands.Create
{
    public class CreateCategoryCommandHandler(
        ICategoryRepository categoryRepository,
        IActionRepository actionRepository,
        IEntityTypeRepository entityTypeRepository,
        ISender sender)
        : IRequestHandler<CreateCategoryCommand, Either<CategoryException, Category>>
    {
        public async Task<Either<CategoryException, Category>> Handle(
            CreateCategoryCommand request,
            CancellationToken cancellationToken)
        {
            var existingCategory = await categoryRepository.GetByNameAsync(
                request.Name,
                cancellationToken);

            return await existingCategory.MatchAsync(
                Some: c => new CategoryAlreadyExistException(c.Id),
                None: () => CreateEntity(request, cancellationToken));
        }

        private async Task<Either<CategoryException, Category>> CreateEntity(
            CreateCategoryCommand request,
            CancellationToken cancellationToken)
        {
            CategoryId? categoryId = null;

            try
            {
                var createdBy = new UserId(request.CreatedBy);

                var category = Category.Create(
                    name: request.Name,
                    createdBy: createdBy,
                    description: request.Description,
                    photoUrl: request.PhotoUrl,
                    cardColor: request.CardColor);

                categoryId = category.Id;

                var created = await categoryRepository.AddAsync(category, cancellationToken);

                var actionOption = await actionRepository.GetByNameAsync(
                    "Create category", cancellationToken);
                if (actionOption.IsNone)
                    throw new InvalidOperationException("Action 'Create category' not found");
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
                    EntityId = created.Id.Value.ToString(),
                    OldValues = null,
                    NewValues =
                        $"Name={created.Name}, Description={created.Description}, " +
                        $"PhotoUrl={created.PhotoUrl}, CardColor={created.CardColor}"
                };

                var historyResult = await sender.Send(historyCommand, cancellationToken);
                historyResult.IfLeft(e => throw e);

                return created;
            }
            catch (Exception exception)
            {
                return new UnhandledCategoryException(
                    categoryId ?? CategoryId.Empty(),
                    exception);
            }
        }
    }
}
