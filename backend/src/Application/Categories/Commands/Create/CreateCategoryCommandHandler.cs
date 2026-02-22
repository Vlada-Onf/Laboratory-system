using Application.Categories.Exceptions;
using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Domain.Categories;
using Domain.Users;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Categories.Commands.Create
{
    public class CreateCategoryCommandHandler(
        ICategoryRepository categoryRepository,
        IHistoryObserver historyObserver)
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

                var newValues = JsonSerializer.Serialize(new
                {
                    category.Id,
                    category.Name,
                    category.Description,
                    category.PhotoUrl,
                    category.CardColor,
                    category.CreatedAt
                });

                await historyObserver.EntityCreatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "Category",
                    entityId: category.Id.Value.ToString(),
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return created;
            }
            catch (Exception exception)
            {
                Console.WriteLine("💥 EXCEPTION in CreateCategoryCommandHandler:");
                Console.WriteLine(exception.Message);
                Console.WriteLine(exception.StackTrace);

                return new UnhandledCategoryException(
                    categoryId ?? CategoryId.Empty(),
                    exception);
            }
        }
    }
}
