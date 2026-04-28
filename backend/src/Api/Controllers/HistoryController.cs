using Api.Dtos;
using Api.Modules.Errors;
using Application.HistoryEntries.Commands.Create;
using Application.HistoryEntries.Queries;
using Application.Common.Interfaces.Queries;
using Domain.History;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("history")]
    public class HistoryController : ControllerBase
    {
        private readonly ISender _sender;
        private readonly IUserQueries _userQueries;

        public HistoryController(ISender sender, IUserQueries userQueries)
        {
            _sender = sender;
            _userQueries = userQueries;
        }

        private async Task<HistoryEntryDto> BuildDtoWithAuthorAsync(History entry, CancellationToken ct)
        {
            var authorOpt = await _userQueries.GetByIdAsync(entry.UserId, ct);
            var author = authorOpt.IsSome
                ? authorOpt.First()
                : throw new InvalidOperationException("Author not found");

            return HistoryEntryDto.FromDomainModel(entry, author);
        }

        [HttpGet("by-user/{userId:guid}")]
        public async Task<ActionResult<IReadOnlyList<HistoryEntryDto>>> GetByUser(
            [FromRoute] Guid userId,
            CancellationToken cancellationToken)
        {
            var entries = await _sender.Send(new GetHistoryByUserQuery(userId), cancellationToken);

            var result = new List<HistoryEntryDto>(entries.Count);
            foreach (var e in entries)
            {
                var dto = await BuildDtoWithAuthorAsync(e, cancellationToken);
                result.Add(dto);
            }

            return result;
        }

        [HttpGet("by-entity/{entityId}")]
        public async Task<ActionResult<IReadOnlyList<HistoryEntryDto>>> GetByEntity(
            [FromRoute] string entityId,
            CancellationToken cancellationToken)
        {
            var entries = await _sender.Send(new GetHistoryByEntityQuery(entityId), cancellationToken);

            var result = new List<HistoryEntryDto>(entries.Count);
            foreach (var e in entries)
            {
                var dto = await BuildDtoWithAuthorAsync(e, cancellationToken);
                result.Add(dto);
            }

            return result;
        }

        [HttpGet("by-type/{entityTypeId:guid}")]
        public async Task<ActionResult<IReadOnlyList<HistoryEntryDto>>> GetByType(
            [FromRoute] Guid entityTypeId,
            CancellationToken cancellationToken)
        {
            var entries = await _sender.Send(
                new GetHistoryByTypeQuery(entityTypeId),
                cancellationToken);

            var result = new List<HistoryEntryDto>(entries.Count);
            foreach (var e in entries)
            {
                var dto = await BuildDtoWithAuthorAsync(e, cancellationToken);
                result.Add(dto);
            }

            return result;
        }

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

            var result = await _sender.Send(input, cancellationToken);

            return result.Match<ActionResult<HistoryEntryDto>>(
                h => BuildDtoWithAuthorAsync(h, cancellationToken).Result,
                e => e.ToObjectResult());
        }

        [HttpGet("all")]
        public async Task<ActionResult<IReadOnlyList<HistoryEntryDto>>> GetAll(
            CancellationToken cancellationToken)
        {
            var entries = await _sender.Send(new GetAllHistoryQuery(), cancellationToken);

            var result = new List<HistoryEntryDto>(entries.Count);
            foreach (var e in entries)
            {
                var dto = await BuildDtoWithAuthorAsync(e, cancellationToken);
                result.Add(dto);
            }

            return result;
        }

        [HttpGet("my")]
        public async Task<ActionResult<IReadOnlyList<HistoryEntryDto>>> GetMyHistory(
            [FromQuery] Guid userId,
            CancellationToken cancellationToken)
        {
            var entries = await _sender.Send(new GetHistoryByUserQuery(userId), cancellationToken);

            var result = new List<HistoryEntryDto>(entries.Count);
            foreach (var e in entries)
            {
                var dto = await BuildDtoWithAuthorAsync(e, cancellationToken);
                result.Add(dto);
            }

            return result;
        }
    }
}
