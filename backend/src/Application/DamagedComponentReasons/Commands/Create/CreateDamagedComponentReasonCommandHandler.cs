using Application.Common.Interfaces.Repositories;
using Application.DamagedComponentReasons.Exceptions;
using Domain.DamagedComponents.Reason;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DamagedComponentReasons.Commands.Create
{
    public sealed class CreateDamagedComponentReasonCommandHandler(
            IDamagedComponentReasonRepository reasonRepository)
            : IRequestHandler<CreateDamagedComponentReasonCommand, Either<DamagedComponentReasonException, DamagedComponentReason>>
    {
        public async Task<Either<DamagedComponentReasonException, DamagedComponentReason>> Handle(
            CreateDamagedComponentReasonCommand request,
            CancellationToken cancellationToken)
        {
            DamagedComponentReasonId? reasonId = null;

            try
            {
                var reason = DamagedComponentReason.Create(
                    name: request.Name,
                    description: request.Description);

                reasonId = reason.Id;

                var created = await reasonRepository.AddAsync(reason, cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledDamagedComponentReasonException(
                    reasonId ?? DamagedComponentReasonId.Empty(),
                    ex);
            }
        }
    }
}