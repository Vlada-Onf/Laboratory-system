using Application.Common.Interfaces.Repositories;
using Domain.Needs.Importance;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.NeedsImportance.Queries
{
    public sealed record GetAllNeedImportancesQuery
            : IRequest<IReadOnlyList<NeedImportance>>;
    public sealed class GetAllNeedImportancesQueryHandler(
        INeedImportanceRepository repository)
        : IRequestHandler<GetAllNeedImportancesQuery, IReadOnlyList<NeedImportance>>
    {
        public async Task<IReadOnlyList<NeedImportance>> Handle(
            GetAllNeedImportancesQuery request,
            CancellationToken cancellationToken)
        {
            return await repository.GetAllAsync(cancellationToken);
        }
    }
}