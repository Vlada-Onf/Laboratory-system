using Application.Categories.Exceptions;
using Application.Common.Interfaces.Repositories;
using Domain.Categories;
using LanguageExt;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Unit = MediatR.Unit;

namespace Application.Categories.Commands.Delete
{
    public class DeleteCategoryCommandHandler(
       ICategoryRepository categoryRepository)
       : IRequestHandler<DeleteCategoryCommand, Either<CategoryException, Category>>
    {
        public async Task<Either<CategoryException, Category>> Handle(
            DeleteCategoryCommand request,
            CancellationToken cancellationToken)
        {
            var categoryId = new CategoryId(request.Id);
            var option = await categoryRepository.GetByIdAsync(categoryId, cancellationToken);

            return await option.MatchAsync(
                Some: category => DeleteEntity(category, cancellationToken),
                None: () => Task.FromResult<Either<CategoryException, Category>>(
                    new CategoryNotFoundException(categoryId)));
        }

        private async Task<Either<CategoryException, Category>> DeleteEntity(
            Category category,
            CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await categoryRepository.DeleteAsync(category, cancellationToken);
                return deleted;
            }
            catch (Exception exception)
            {
                return new UnhandledCategoryException(category.Id, exception);
            }
        }
    }
}