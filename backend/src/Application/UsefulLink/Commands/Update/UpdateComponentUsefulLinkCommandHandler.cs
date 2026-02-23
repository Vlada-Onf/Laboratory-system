using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.UsefulLink.Exceptions;
using Domain.Components.UsefulLink;
using Domain.Users;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.UsefulLink.Commands.Update
{
    public sealed class UpdateComponentUsefulLinkCommandHandler(
        IComponentUsefulLinkRepository linkRepository,
        IHistoryObserver historyObserver)
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

                var updatedBy = new UserId(request.UpdatedBy);

                link.Update(
                    title: request.Title,
                    url: request.Url,
                    updatedBy: updatedBy);

                var updated = await linkRepository.UpdateAsync(link, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
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

                await historyObserver.EntityUpdatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "ComponentUsefulLink",
                    entityId: link.Id.Value.ToString(),
                    oldValues: oldValues,
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledComponentUsefulLinkException(link.Id, ex);
            }
        }
    }
}
