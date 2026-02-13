using Application.Common.Interfaces.Repositories;
using Domain.History.EntityTypes;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.EntityTypes.Queries
{
    public sealed record GetEntityTypeByIdQuery(Guid Id)
        : IRequest<Option<EntityType>>;
    public sealed class GetEntityTypeByIdQueryHandler(
        IEntityTypeRepository repository)
        : IRequestHandler<GetEntityTypeByIdQuery, Option<EntityType>>
    {
        public async Task<Option<EntityType>> Handle(
            GetEntityTypeByIdQuery request,
            CancellationToken cancellationToken)
        {
            var id = new EntityTypeId(request.Id);
            return await repository.GetByIdAsync(id, cancellationToken);
        }
    }
}
