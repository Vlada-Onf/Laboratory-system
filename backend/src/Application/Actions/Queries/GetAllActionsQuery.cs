using Application.Common.Interfaces.Repositories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Actions.Queries
{
    public sealed record GetAllActionsQuery
            : IRequest<IReadOnlyList<Action>>;
    public sealed class GetAllActionsQueryHandler(
        IActionRepository actionRepository)
        : IRequestHandler<GetAllActionsQuery, IReadOnlyList<Action>>
    {
        public async Task<IReadOnlyList<Action>> Handle(
            GetAllActionsQuery request,
            CancellationToken cancellationToken)
        {
            return await actionRepository.GetAllAsync(cancellationToken);
        }
    }
}
