using Application.Common.Interfaces.Repositories;
using Domain.History.Actions;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Actions.Queries
{
    public sealed record GetActionByIdQuery(Guid Id)
            : IRequest<Option<Action>>;
    public sealed class GetActionByIdQueryHandler(
        IActionRepository actionRepository)
        : IRequestHandler<GetActionByIdQuery, Option<Action>>
    {
        public async Task<Option<Action>> Handle(
            GetActionByIdQuery request,
            CancellationToken cancellationToken)
        {
            var actionId = new ActionId(request.Id);
            return await actionRepository.GetByIdAsync(actionId, cancellationToken);
        }
    }
}
