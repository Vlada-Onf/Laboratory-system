using Api.Dtos;
using Api.Modules.Errors;
using Application.Common.Interfaces.Queries;
using Application.DamagedComponents.Commands.Create;
using Application.DamagedComponents.Commands.Delete;
using Application.DamagedComponents.Commands.Update;
using Domain.DamagedComponents;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("damaged-components")]
    [Authorize]
    public class DamagedComponentsController(
                IDamagedComponentQueries queries,
                ISender sender) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<DamagedComponentDto>>> GetAll(
            CancellationToken cancellationToken)
        {
            var items = await queries.GetAllAsync(cancellationToken);
            return items.Select(DamagedComponentDto.FromDomainModel).ToList();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<DamagedComponentDto>> GetById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var option = await queries.GetByIdAsync(new DamagedComponentId(id), cancellationToken);

            return option.Match<ActionResult<DamagedComponentDto>>(
                x => DamagedComponentDto.FromDomainModel(x),
                () => NotFound());
        }

        [HttpPost]
        public async Task<ActionResult<DamagedComponentDto>> Create(
            [FromBody] CreateDamagedComponentDto request,
            CancellationToken cancellationToken)
        {
            var input = new CreateDamagedComponentCommand
            {
                ComponentId = request.ComponentId,
                ReasonId = request.ReasonId,
                Quantity = request.Quantity,
                RecordedBy = request.RecordedBy,
                PerformedBy = request.PerformedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<DamagedComponentDto>>(
                d => DamagedComponentDto.FromDomainModel(d),
                e => e.ToObjectResult());
        }

        [HttpPut]
        public async Task<ActionResult<DamagedComponentDto>> Update(
            [FromBody] UpdateDamagedComponentDto request,
            CancellationToken cancellationToken)
        {
            var input = new UpdateDamagedComponentCommand
            {
                Id = request.Id,
                ComponentId = request.ComponentId,
                ReasonId = request.ReasonId,
                Quantity = request.Quantity,
                LastUpdatedBy = request.UpdatedBy,
                PerformedBy = request.PerformedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<DamagedComponentDto>>(
                d => DamagedComponentDto.FromDomainModel(d),
                e => e.ToObjectResult());
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(
            [FromRoute] Guid id,
            [FromQuery] Guid deletedBy,
            CancellationToken cancellationToken)
        {
            var input = new DeleteDamagedComponentCommand(id, deletedBy);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
