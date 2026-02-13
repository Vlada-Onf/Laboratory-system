using Application.Common.Interfaces.Repositories;
using Application.UsefulLink.Exceptions;
using Domain.Components.UsefulLink;
using Domain.Users;
using LanguageExt;
using MediatR;

namespace Application.UsefulLink.Commands.Update
{
    public sealed class UpdateComponentUsefulLinkCommandHandler(
            IComponentUsefulLinkRepository linkRepository)
            : IRequestHandler<UpdateComponentUsefulLinkCommand, Either<ComponentUsefulLinkException, ComponentUsefulLink>>
    {
        public async Task<Either<ComponentUsefulLinkException, ComponentUsefulLink>> Handle(
            UpdateComponentUsefulLinkCommand request,
            CancellationToken cancellationToken)
        {
            var id = new ComponentUsefulLinkId(request.Id);
            var option = await linkRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: link => UpdateEntity(link, request, cancellationToken),
                None: () => Task.FromResult<Either<ComponentUsefulLinkException, ComponentUsefulLink>>(
                    new ComponentUsefulLinkNotFoundException(id)));
        }

        private async Task<Either<ComponentUsefulLinkException, ComponentUsefulLink>> UpdateEntity(
            ComponentUsefulLink link,
            UpdateComponentUsefulLinkCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                var updatedBy = new UserId(request.UpdatedBy);

                link.Update(
                    title: request.Title,
                    url: request.Url,
                    updatedBy: updatedBy);

                var updated = await linkRepository.UpdateAsync(link, cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledComponentUsefulLinkException(link.Id, ex);
            }
        }
    }
}
