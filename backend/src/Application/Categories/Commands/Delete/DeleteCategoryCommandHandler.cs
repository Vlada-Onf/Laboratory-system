using Application.Categories.Exceptions;
using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Domain.Categories;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Categories.Commands.Delete
{
    public class DeleteCategoryCommandHandler(
        ICategoryRepository categoryRepository,
        IHistoryObserver historyObserver)
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
                var oldValues = JsonSerializer.Serialize(new
                {
                    category.Id,
                    category.Name,
                    category.Description,
                    category.PhotoUrl,
                    category.CardColor,
                    category.CreatedAt
                });

                var deleted = await categoryRepository.DeleteAsync(category, cancellationToken);

                await historyObserver.EntityDeletedAsync(
                    userId: performedBy,
                    entityTypeName: "Category",
                    entityId: category.Id.Value.ToString(),
                    oldValues: oldValues,
                    cancellationToken: cancellationToken);

                return deleted;
            }
            catch (Exception exception)
            {

                return new UnhandledCategoryException(category.Id, exception);
            }
        }
    }
}
