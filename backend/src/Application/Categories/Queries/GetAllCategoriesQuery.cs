using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Categories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Categories.Queries
{
    public sealed record GetAllCategoriesQuery : IRequest<IReadOnlyList<Category>>;

    public sealed class GetCategoriesQueryHandler(
        ICategoryQueries categoryQueries)
        : IRequestHandler<GetAllCategoriesQuery, IReadOnlyList<Category>>
    {
        public async Task<IReadOnlyList<Category>> Handle(
            GetAllCategoriesQuery request,
            CancellationToken cancellationToken)
        {
            return await categoryQueries.GetAllAsync(cancellationToken);
        }
    }
}
