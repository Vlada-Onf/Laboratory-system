using Application.Common.Interfaces.Repositories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Categories.Queries.GetCategories
{
    public sealed class GetCategoriesQueryHandler
           : IRequestHandler<GetCategoriesQuery, IReadOnlyList<CategoryDto>>
    {
        private readonly ICategoryRepository _categoryRepository;

        public GetCategoriesQueryHandler(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<IReadOnlyList<CategoryDto>> Handle(
            GetCategoriesQuery request,
            CancellationToken cancellationToken)
        {
            var categories = await _categoryRepository.GetAllAsync(cancellationToken);

            return categories
                .Select(c => new CategoryDto
                {
                    Id = c.Id.Value,
                    Name = c.Name,
                    Description = c.Description,
                    PhotoUrl = c.PhotoUrl,
                    CardColor = c.CardColor,
                    CreatedAt = c.CreatedAt
                })
                .ToList();
        }
    }
}
