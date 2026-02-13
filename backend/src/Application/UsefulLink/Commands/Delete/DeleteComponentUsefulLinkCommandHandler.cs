using Application.Common.Interfaces.Repositories;
using Application.UsefulLink.Exceptions;
using Domain.Components.UsefulLink;
using LanguageExt;
using MediatR;

namespace Application.UsefulLink.Commands.Delete
{
    public sealed class DeleteComponentUsefulLinkCommandHandler(
            IComponentUsefulLinkRepository linkRepository)
            : IRequestHandler<DeleteComponentUsefulLinkCommand, Either<ComponentUsefulLinkException, ComponentUsefulLink>>
    {
        public async Task<Either<ComponentUsefulLinkException, ComponentUsefulLink>> Handle(
            DeleteComponentUsefulLinkCommand request,
            CancellationToken cancellationToken)
        {
            var id = new ComponentUsefulLinkId(request.Id);
            var option = await linkRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: link => DeleteEntity(link, cancellationToken),
                None: () => Task.FromResult<Either<ComponentUsefulLinkException, ComponentUsefulLink>>(
                    new ComponentUsefulLinkNotFoundException(id)));
        }

        private async Task<Either<ComponentUsefulLinkException, ComponentUsefulLink>> DeleteEntity(
            ComponentUsefulLink link,
            CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await linkRepository.DeleteAsync(link, cancellationToken);
                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledComponentUsefulLinkException(link.Id, ex);
            }
        }
    }
}
