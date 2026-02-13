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
    public sealed record GetNeedStatusByIdQuery(Guid Id)
            : IRequest<Option<NeedStatus>>;
    public sealed class GetNeedStatusByIdQueryHandler(
        INeedStatusRepository repository)
        : IRequestHandler<GetNeedStatusByIdQuery, Option<NeedStatus>>
    {
        public async Task<Option<NeedStatus>> Handle(
            GetNeedStatusByIdQuery request,
            CancellationToken cancellationToken)
        {
            var id = new NeedStatusId(request.Id);
            return await repository.GetByIdAsync(id, cancellationToken);
        }
    }
}
