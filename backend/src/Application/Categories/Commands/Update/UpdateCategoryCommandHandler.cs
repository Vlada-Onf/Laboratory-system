using Application.Categories.Exceptions;
using Application.Common.Interfaces.Repositories;
using Domain.Categories;
using Domain.Users;
using LanguageExt;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Unit = MediatR.Unit;

namespace Application.Categories.Commands.Update
{
    public class UpdateCategoryCommandHandler(
        ICategoryRepository categoryRepository)
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
                var lastUpdatedBy = new UserId(request.LastUpdatedBy);

                category.Update(
                    name: request.Name,
                    description: request.Description,
                    photoUrl: request.PhotoUrl,
                    cardColor: request.CardColor,
                    lastUpdatedBy: lastUpdatedBy);
                return category;
            }
            catch (Exception exception)
            {
                return new UnhandledCategoryException(category.Id, exception);
            }
        }
    }
}