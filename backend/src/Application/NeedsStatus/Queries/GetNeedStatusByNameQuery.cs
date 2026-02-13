using Application.Common.Interfaces.Repositories;
using Domain.Needs.Status;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.NeedsStatus.Queries
{
    public sealed record GetNeedStatusByNameQuery(string Name)
            : IRequest<Option<NeedStatus>>;
    public sealed class GetNeedStatusByNameQueryHandler(
        INeedStatusRepository repository)
        : IRequestHandler<GetNeedStatusByNameQuery, Option<NeedStatus>>
    {
        public async Task<Option<NeedStatus>> Handle(
            GetNeedStatusByNameQuery request,
            CancellationToken cancellationToken)
        {
            return await repository.GetByNameAsync(request.Name, cancellationToken);
        }
    }
}
