using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.UsefulLink.Exceptions;
using Domain.Components.UsefulLink;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.UsefulLink.Commands.Delete
{
    public sealed class DeleteComponentUsefulLinkCommandHandler(
        IComponentUsefulLinkRepository linkRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<DeleteComponentUsefulLinkCommand, Either<ComponentUsefulLinkException, ComponentUsefulLink>>
    {
        public async Task<Either<ComponentUsefulLinkException, ComponentUsefulLink>> Handle(
            DeleteComponentUsefulLinkCommand request,
            CancellationToken cancellationToken)
        {
            var id = new ComponentUsefulLinkId(request.Id);
            var option = await linkRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: link => DeleteEntity(link, request.PerformedBy, cancellationToken),
                None: () => Task.FromResult<Either<ComponentUsefulLinkException, ComponentUsefulLink>>(
                    new ComponentUsefulLinkNotFoundException(id)));
        }

        private async Task<Either<ComponentUsefulLinkException, ComponentUsefulLink>> DeleteEntity(
            ComponentUsefulLink link,
            Guid performedBy,
            CancellationToken cancellationToken)
        {
            try
            {
                var oldValues = JsonSerializer.Serialize(new
                {
                    link.Id,
                    link.ComponentId,
                    link.Title,
                    link.Url,
                    link.CreatedBy,
                    link.CreatedAt,
                    link.LastUpdatedBy,
                    link.LastUpdatedAt
                });

                var deleted = await linkRepository.DeleteAsync(link, cancellationToken);

                await historyObserver.EntityDeletedAsync(
                    userId: performedBy,
                    entityTypeName: "ComponentUsefulLink",
                    entityId: link.Id.Value.ToString(),
                    oldValues: oldValues,
                    cancellationToken: cancellationToken);

                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledComponentUsefulLinkException(link.Id, ex);
            }
        }
    }
}
