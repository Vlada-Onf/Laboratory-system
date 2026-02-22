using Application.Categories.Exceptions;
using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Domain.Categories;
using Domain.Users;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Categories.Commands.Update
{
    public class UpdateCategoryCommandHandler(
        ICategoryRepository categoryRepository,
        IHistoryObserver historyObserver)
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
                var oldValues = JsonSerializer.Serialize(new
                {
                    category.Id,
                    category.Name,
                    category.Description,
                    category.PhotoUrl,
                    category.CardColor
                });

                var lastUpdatedBy = new UserId(request.LastUpdatedBy);

                category.Update(
                    name: request.Name,
                    description: request.Description,
                    photoUrl: request.PhotoUrl,
                    cardColor: request.CardColor,
                    lastUpdatedBy: lastUpdatedBy);

                var updated = await categoryRepository.UpdateAsync(category, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    category.Id,
                    category.Name,
                    category.Description,
                    category.PhotoUrl,
                    category.CardColor
                });

                await historyObserver.EntityUpdatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "Category",
                    entityId: category.Id.Value.ToString(),
                    oldValues: oldValues,
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return updated;
            }
            catch (Exception exception)
            {
                return new UnhandledCategoryException(category.Id, exception);
            }
        }
    }
}
