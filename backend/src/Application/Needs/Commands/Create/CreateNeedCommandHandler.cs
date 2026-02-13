using Application.Common.Interfaces.Repositories;
using Application.Needs.Exceptions;
using Domain.Components;
using Domain.Needs;
using Domain.Needs.Importance;
using Domain.Users;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Needs.Commands.Create
{
    public sealed class CreateNeedCommandHandler(
            INeedRepository needRepository,
            IComponentRepository componentRepository)
            : IRequestHandler<CreateNeedCommand, Either<NeedException, Need>>
    {
        public async Task<Either<NeedException, Need>> Handle(
            CreateNeedCommand request,
            CancellationToken cancellationToken)
        {
            NeedId? needId = null;

            try
            {
                var componentId = new ComponentId(request.ComponentId);

                var componentOption = await componentRepository.GetByIdAsync(componentId, cancellationToken);
                if (componentOption.IsNone)
                    return new UnhandledNeedException(NeedId.Empty());

                var requestedBy = new UserId(request.RequestedBy);
                var importanceId = new NeedImportanceId(request.ImportanceId);

                var need = Need.Create(
                    componentId: componentId,
                    quantityNeeded: request.QuantityNeeded,
                    requestedBy: requestedBy,
                    description: request.Description,
                    importanceId: importanceId);

                needId = need.Id;

                var created = await needRepository.AddAsync(need, cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedException(
                    needId ?? NeedId.Empty(),
                    ex);
            }
        }
    }
}