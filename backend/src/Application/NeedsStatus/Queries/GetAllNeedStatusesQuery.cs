using Application.Common.Interfaces.Repositories;
using Domain.Needs.Status;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.NeedsStatus.Queries
{
    public sealed record GetAllNeedStatusesQuery
            : IRequest<IReadOnlyList<NeedStatus>>;
    public sealed class GetAllNeedStatusesQueryHandler(
        INeedStatusRepository repository)
        : IRequestHandler<GetAllNeedStatusesQuery, IReadOnlyList<NeedStatus>>
    {
        public async Task<IReadOnlyList<NeedStatus>> Handle(
            GetAllNeedStatusesQuery request,
            CancellationToken cancellationToken)
        {
            return await repository.GetAllAsync(cancellationToken);
        }
    }
}
