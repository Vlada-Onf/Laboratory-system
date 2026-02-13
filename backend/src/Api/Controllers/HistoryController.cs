using Api.Dtos;
using Api.Modules.Errors;
using Application.HistoryEntries.Commands.Create;
using Application.HistoryEntries.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("history")]
    public class HistoryController(ISender sender) : ControllerBase
    {
        // GET /history/by-user/{userId}
        [HttpGet("by-user/{userId:guid}")]
        public async Task<ActionResult<IReadOnlyList<HistoryEntryDto>>> GetByUser(
            [FromRoute] Guid userId,
            CancellationToken cancellationToken)
        {
            var entries = await sender.Send(new GetHistoryByUserQuery(userId), cancellationToken);

            return entries
                .Select(HistoryEntryDto.FromDomainModel)
                .ToList();
        }

        // GET /history/by-entity/{entityId}
        [HttpGet("by-entity/{entityId}")]
        public async Task<ActionResult<IReadOnlyList<HistoryEntryDto>>> GetByEntity(
            [FromRoute] string entityId,
            CancellationToken cancellationToken)
        {
            var entries = await sender.Send(new GetHistoryByEntityQuery(entityId), cancellationToken);

            return entries
                .Select(HistoryEntryDto.FromDomainModel)
                .ToList();
        }

        // GET /history/by-entity-and-type?entityTypeId={guid}&entityId={id}
        [HttpGet("by-entity-and-type")]
        public async Task<ActionResult<IReadOnlyList<HistoryEntryDto>>> GetByEntityAndType(
            [FromQuery] Guid entityTypeId,
            [FromQuery] string entityId,
            CancellationToken cancellationToken)
        {
            var entries = await sender.Send(
                new GetHistoryByEntityAndTypeQuery(entityTypeId, entityId),
                cancellationToken);

            return entries
                .Select(HistoryEntryDto.FromDomainModel)
                .ToList();
        }

        // POST /history
        [HttpPost]
        public async Task<ActionResult<HistoryEntryDto>> Create(
            [FromBody] CreateHistoryEntryDto request,
            CancellationToken cancellationToken)
        {
            var input = new CreateHistoryCommand
            {
                UserId = request.UserId,
                ActionId = request.ActionId,
                EntityTypeId = request.EntityTypeId,
                EntityId = request.EntityId,
                OldValues = request.OldValues,
                NewValues = request.NewValues
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<HistoryEntryDto>>(
                h => HistoryEntryDto.FromDomainModel(h),
                e => e.ToObjectResult());
        }
    }
}
