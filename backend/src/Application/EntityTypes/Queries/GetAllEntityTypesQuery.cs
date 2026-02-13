using Application.Common.Interfaces.Repositories;
using Domain.History.EntityTypes;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.EntityTypes.Queries
{
    public sealed record GetAllEntityTypesQuery
        : IRequest<IReadOnlyList<EntityType>>;
    public sealed class GetAllEntityTypesQueryHandler(
        IEntityTypeRepository repository)
        : IRequestHandler<GetAllEntityTypesQuery, IReadOnlyList<EntityType>>
    {
        public async Task<IReadOnlyList<EntityType>> Handle(
            GetAllEntityTypesQuery request,
            CancellationToken cancellationToken)
        {
            return await repository.GetAllAsync(cancellationToken);
        }
    }
}
