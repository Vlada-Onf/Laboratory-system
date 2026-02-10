using Application.Common.Interfaces.Repositories;
using Domain.Categories;
using LanguageExt;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Categories.Queries.GetCategoryById
{
    public sealed class GetCategoryByIdQueryHandler
        : IRequestHandler<GetCategoryByIdQuery, CategoryDto>
    {
        private readonly ICategoryRepository _categoryRepository;

        public GetCategoryByIdQueryHandler(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<CategoryDto> Handle(
            GetCategoryByIdQuery request,
            CancellationToken cancellationToken)
        {
            var id = new CategoryId(request.Id);

            var categoryOption = await _categoryRepository.GetByIdAsync(id, cancellationToken);

            var category = categoryOption.Match(
                Some: c => c,
                None: () => throw new InvalidOperationException("Категорію не знайдено")
            );

            return new CategoryDto
            {
                Id = category.Id.Value,
                Name = category.Name,
                Description = category.Description,
                PhotoUrl = category.PhotoUrl,
                CardColor = category.CardColor,
                CreatedAt = category.CreatedAt
            };
        }
    }
}
