using Application.Common.Interfaces.Queries;
using Domain.Categories;
using LanguageExt;
using MediatR;

namespace Application.Categories.Queries
{
    public sealed record GetCategoryByIdQuery(Guid Id) : IRequest<Option<Category>>;

    public sealed class GetCategoryByIdQueryHandler(
        ICategoryQueries categoryQueries)
        : IRequestHandler<GetCategoryByIdQuery, Option<Category>>
    {
        public async Task<Option<Category>> Handle(
            GetCategoryByIdQuery request,
            CancellationToken cancellationToken)
        {
            var categoryId = new CategoryId(request.Id);
            return await categoryQueries.GetByIdAsync(categoryId, cancellationToken);
        }
    }
}
