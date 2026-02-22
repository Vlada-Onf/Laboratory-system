using Api.Dtos;
using Api.Modules.Errors;
using Application.Needs.Commands.Create;
using Application.Needs.Commands.Delete;
using Application.Needs.Commands.Update;
using Application.Needs.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("needs")]
    public class NeedsController(ISender sender) : ControllerBase
    {
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<NeedDto>> GetById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var result = await sender.Send(new GetNeedByIdQuery(id), cancellationToken);

            return result.Match<ActionResult<NeedDto>>(
                n => NeedDto.FromDomainModel(n),
                () => NotFound());
        }

        [HttpGet("by-component/{componentId:guid}")]
        public async Task<ActionResult<IReadOnlyList<NeedDto>>> GetByComponent(
            [FromRoute] Guid componentId,
            CancellationToken cancellationToken)
        {
            var needs = await sender.Send(new GetNeedsByComponentIdQuery(componentId), cancellationToken);

            return needs
                .Select(NeedDto.FromDomainModel)
                .ToList();
        }

        [HttpGet("by-user/{userId:guid}")]
        public async Task<ActionResult<IReadOnlyList<NeedDto>>> GetByUser(
            [FromRoute] Guid userId,
            CancellationToken cancellationToken)
        {
            var needs = await sender.Send(new GetNeedsByUserQuery(userId), cancellationToken);

            return needs
                .Select(NeedDto.FromDomainModel)
                .ToList();
        }

        [HttpGet("by-importance/{importanceId:guid}")]
        public async Task<ActionResult<IReadOnlyList<NeedDto>>> GetByImportance(
            [FromRoute] Guid importanceId,
            CancellationToken cancellationToken)
        {
            var needs = await sender.Send(new GetNeedsByImportanceQuery(importanceId), cancellationToken);

            return needs
                .Select(NeedDto.FromDomainModel)
                .ToList();
        }

        [HttpGet("by-status/{statusId:guid}")]
        public async Task<ActionResult<IReadOnlyList<NeedDto>>> GetByStatus(
            [FromRoute] Guid statusId,
            CancellationToken cancellationToken)
        {
            var needs = await sender.Send(new GetNeedsByStatusQuery(statusId), cancellationToken);

            return needs
                .Select(NeedDto.FromDomainModel)
                .ToList();
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<NeedDto>>> GetAll(
            CancellationToken cancellationToken)
        {
            var needs = await sender.Send(new GetAllNeedsQuery(), cancellationToken);

            return needs
                .Select(NeedDto.FromDomainModel)
                .ToList();
        }

        [HttpPost]
        public async Task<ActionResult<NeedDto>> Create(
            [FromBody] CreateNeedDto request,
            CancellationToken cancellationToken)
        {
            var input = new CreateNeedCommand
            {
                ComponentId = request.ComponentId,
                QuantityNeeded = request.QuantityNeeded,
                RequestedBy = request.RequestedBy,
                Description = request.Description,
                StatusId = request.StatusId,
                ImportanceId = request.ImportanceId,
                CompletionReason = request.CompletionReason,
                PerformedBy = request.PerformedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<NeedDto>>(
                n => NeedDto.FromDomainModel(n),
                e => e.ToObjectResult());
        }

        [HttpPut("details")]
        public async Task<ActionResult<NeedDto>> UpdateDetails(
            [FromBody] UpdateNeedDetailsDto request,
            CancellationToken cancellationToken)
        {
            var input = new UpdateNeedDetailsCommand
            {
                Id = request.Id,
                QuantityNeeded = request.QuantityNeeded,
                Description = request.Description,
                ImportanceId = request.ImportanceId,
                CompletionReason = request.CompletionReason,
                StatusId = request.StatusId,
                PerformedBy = request.PerformedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<NeedDto>>(
                n => NeedDto.FromDomainModel(n),
                e => e.ToObjectResult());
        }

        [HttpPut("importance")]
        public async Task<ActionResult<NeedDto>> UpdateImportance(
            [FromBody] UpdateNeedImportanceDto request,
            CancellationToken cancellationToken)
        {
            var input = new UpdateNeedImportanceCommand
            {
                Id = request.Id,
                ImportanceId = request.ImportanceId,
                PerformedBy = request.PerformedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<NeedDto>>(
                n => NeedDto.FromDomainModel(n),
                e => e.ToObjectResult());
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(
            [FromRoute] Guid id,
            [FromQuery] Guid performedBy,
            CancellationToken cancellationToken)
        {
            var input = new DeleteNeedCommand(id, performedBy);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
