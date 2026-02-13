using Application.Common.Interfaces.Repositories;
using Application.Needs.Exceptions;
using Domain.Needs;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Needs.Commands.Delete
{
    public sealed class DeleteNeedCommandHandler(
        INeedRepository needRepository)
        : IRequestHandler<DeleteNeedCommand, Either<NeedException, Need>>
    {
        public async Task<Either<NeedException, Need>> Handle(
            DeleteNeedCommand request,
            CancellationToken cancellationToken)
        {
            var needId = new NeedId(request.Id);
            var option = await needRepository.GetByIdAsync(needId, cancellationToken);

            return await option.MatchAsync(
                Some: need => DeleteEntity(need, cancellationToken),
                None: () => Task.FromResult<Either<NeedException, Need>>(
                    new NeedNotFoundException(needId)));
        }

        private async Task<Either<NeedException, Need>> DeleteEntity(
            Need need,
            CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await needRepository.DeleteAsync(need, cancellationToken);
                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedException(need.Id, ex);
            }
        }
    }
}
