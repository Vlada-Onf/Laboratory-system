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
        : IRequestHandler<DeleteCategoryCommand, Either<CategoryException, MediatR.Unit>>
    {
        public async Task<Either<CategoryException, MediatR.Unit>> Handle(
            DeleteCategoryCommand request,
            CancellationToken cancellationToken)
        {
            var categoryId = new CategoryId(request.Id);

            var option = await categoryRepository.GetByIdAsync(categoryId, cancellationToken);

            return await option.MatchAsync(
                Some: async category =>
                {
                    try
                    {
                        await categoryRepository.RemoveAsync(category, cancellationToken);
                        return MediatR.Unit.Value;
                    }
                    catch (Exception exception)
                    {
                        return new UnhandledCategoryException(categoryId, exception);
                    }
                },
                None: () => Task.FromResult<Either<CategoryException, MediatR.Unit>>(
                    new CategoryNotFoundException(categoryId)));
        }
    }
}
