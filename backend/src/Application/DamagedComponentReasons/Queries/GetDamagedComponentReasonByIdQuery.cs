using Application.Common.Interfaces.Queries;
using Domain.DamagedComponents.Reason;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DamagedComponentReasons.Queries
{
    public sealed record GetDamagedComponentReasonByIdQuery(Guid Id)
         : IRequest<Option<DamagedComponentReason>>;
    public sealed class GetDamagedComponentReasonByIdQueryHandler(
        IDamagedComponentReasonQueries queries)
        : IRequestHandler<GetDamagedComponentReasonByIdQuery, Option<DamagedComponentReason>>
    {
        public async Task<Option<DamagedComponentReason>> Handle(
            GetDamagedComponentReasonByIdQuery request,
            CancellationToken cancellationToken)
        {
            var id = new DamagedComponentReasonId(request.Id);
            return await queries.GetByIdAsync(id, cancellationToken);
        }
    }
}
