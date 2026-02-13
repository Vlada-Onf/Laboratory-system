using Application.Common.Interfaces.Repositories;
using Domain.Needs.Importance;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.NeedsImportance.Queries
{
    public sealed record GetNeedImportanceByLevelQuery(int Level)
            : IRequest<Option<NeedImportance>>;
    public sealed class GetNeedImportanceByLevelQueryHandler(
        INeedImportanceRepository repository)
        : IRequestHandler<GetNeedImportanceByLevelQuery, Option<NeedImportance>>
    {
        public async Task<Option<NeedImportance>> Handle(
            GetNeedImportanceByLevelQuery request,
            CancellationToken cancellationToken)
        {
            return await repository.GetByLevelAsync(request.Level, cancellationToken);
        }
    }
}
