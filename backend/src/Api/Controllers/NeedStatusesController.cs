using Api.Dtos;
using Api.Modules.Errors;
using Application.NeedsStatus.Commands.Create;
using Application.NeedsStatus.Commands.Delete;
using Application.NeedsStatus.Commands.Update;
using Application.NeedsStatus.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("need-statuses")]
    [Authorize]
    public class NeedStatusesController(ISender sender) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<NeedStatusDto>>> GetAll(
            CancellationToken cancellationToken)
        {
            var statuses = await sender.Send(new GetAllNeedStatusesQuery(), cancellationToken);

            return statuses
                .Select(NeedStatusDto.FromDomainModel)
                .ToList();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<NeedStatusDto>> GetById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var result = await sender.Send(new GetNeedStatusByIdQuery(id), cancellationToken);

            return result.Match<ActionResult<NeedStatusDto>>(
                s => NeedStatusDto.FromDomainModel(s),
                () => NotFound());
        }

        [HttpGet("by-name")]
        public async Task<ActionResult<NeedStatusDto>> GetByName(
            [FromQuery] string name,
            CancellationToken cancellationToken)
        {
            var result = await sender.Send(new GetNeedStatusByNameQuery(name), cancellationToken);

            return result.Match<ActionResult<NeedStatusDto>>(
                s => NeedStatusDto.FromDomainModel(s),
                () => NotFound());
        }

        [HttpPost]
        public async Task<ActionResult<NeedStatusDto>> Create(
            [FromBody] CreateNeedStatusDto request,
            CancellationToken cancellationToken)
        {
            var input = new CreateNeedStatusCommand
            {
                Name = request.Name,
                Description = request.Description,
                PerformedBy = request.PerformedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<NeedStatusDto>>(
                s => NeedStatusDto.FromDomainModel(s),
                e => e.ToObjectResult());
        }

        [HttpPut]
        public async Task<ActionResult<NeedStatusDto>> Update(
            [FromBody] UpdateNeedStatusDto request,
            CancellationToken cancellationToken)
        {
            var input = new UpdateNeedStatusCommand
            {
                Id = request.Id,
                Name = request.Name,
                Description = request.Description,
                PerformedBy = request.PerformedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<NeedStatusDto>>(
                s => NeedStatusDto.FromDomainModel(s),
                e => e.ToObjectResult());
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(
            [FromRoute] Guid id,
            [FromQuery] Guid performedBy,
            CancellationToken cancellationToken)
        {
            var input = new DeleteNeedStatusCommand(id, performedBy);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
