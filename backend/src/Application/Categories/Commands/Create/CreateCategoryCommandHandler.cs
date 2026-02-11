using Application.Categories.Exceptions;
using Application.Common.Interfaces.Repositories;
using Domain.Categories;
using Domain.Users;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Categories.Commands.Create
{
    public class CreateCategoryCommandHandler(
        ICategoryRepository categoryRepository)
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
            try
            {
                var createdBy = new UserId(request.CreatedBy);

                var category = Category.Create(
                    name: request.Name,
                    createdBy: createdBy,
                    description: request.Description,
                    photoUrl: request.PhotoUrl,
                    cardColor: request.CardColor);

                var created = await categoryRepository.AddAsync(category, cancellationToken);

                return created;
            }
            catch (Exception exception)
            {
                return new UnhandledCategoryException(CategoryId.Empty(), exception);
            }
        }
    }
}