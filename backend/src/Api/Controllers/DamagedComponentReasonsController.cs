using Api.Dtos;
using Api.Modules.Errors;
using Application.DamagedComponentReasons.Commands.Create;
using Application.DamagedComponentReasons.Commands.Delete;
using Application.DamagedComponentReasons.Commands.Update;
using Application.DamagedComponentReasons.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("damaged-component-reasons")]
    [Authorize]
    public class DamagedComponentReasonsController(ISender sender) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<DamagedComponentReasonDto>>> GetAll(
            CancellationToken cancellationToken)
        {
            var reasons = await sender.Send(new GetAllDamagedComponentReasonsQuery(), cancellationToken);

            return reasons
                .Select(DamagedComponentReasonDto.FromDomainModel)
                .ToList();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<DamagedComponentReasonDto>> GetById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var result = await sender.Send(new GetDamagedComponentReasonByIdQuery(id), cancellationToken);

            return result.Match<ActionResult<DamagedComponentReasonDto>>(
                r => DamagedComponentReasonDto.FromDomainModel(r),
                () => NotFound());
        }

        [HttpPost]
        public async Task<ActionResult<DamagedComponentReasonDto>> Create(
            [FromBody] CreateDamagedComponentReasonDto request,
            CancellationToken cancellationToken)
        {
            var input = new CreateDamagedComponentReasonCommand
            {
                Name = request.Name,
                Description = request.Description,
                PerformedBy = request.PerformedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<DamagedComponentReasonDto>>(
                r => DamagedComponentReasonDto.FromDomainModel(r),
                e => e.ToObjectResult());
        }

        [HttpPut]
        public async Task<ActionResult<DamagedComponentReasonDto>> Update(
            [FromBody] UpdateDamagedComponentReasonDto request,
            CancellationToken cancellationToken)
        {
            var input = new UpdateDamagedComponentReasonCommand
            {
                Id = request.Id,
                Name = request.Name,
                Description = request.Description,
                PerformedBy = request.PerformedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<DamagedComponentReasonDto>>(
                r => DamagedComponentReasonDto.FromDomainModel(r),
                e => e.ToObjectResult());
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(
            [FromRoute] Guid id,
            [FromQuery] Guid performedBy,
            CancellationToken cancellationToken)
        {
            var input = new DeleteDamagedComponentReasonCommand(id, performedBy);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
