using Api.Dtos;
using Api.Modules.Errors;
using Application.UsefulLink.Commands.Create;
using Application.UsefulLink.Commands.Delete;
using Application.UsefulLink.Commands.Update;
using Application.UsefulLink.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("component-useful-links")]
    [Authorize]
    public class ComponentUsefulLinksController(ISender sender) : ControllerBase
    {
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ComponentUsefulLinkDto>> GetById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var result = await sender.Send(new GetComponentUsefulLinkByIdQuery(id), cancellationToken);

            return result.Match<ActionResult<ComponentUsefulLinkDto>>(
                link => ComponentUsefulLinkDto.FromDomainModel(link),
                () => NotFound());
        }

        [HttpGet("by-component/{componentId:guid}")]
        public async Task<ActionResult<IReadOnlyList<ComponentUsefulLinkDto>>> GetByComponentId(
            [FromRoute] Guid componentId,
            CancellationToken cancellationToken)
        {
            var links = await sender.Send(
                new GetComponentUsefulLinksByComponentIdQuery(componentId),
                cancellationToken);

            return links
                .Select(ComponentUsefulLinkDto.FromDomainModel)
                .ToList();
        }

        [HttpPost]
        public async Task<ActionResult<ComponentUsefulLinkDto>> Create(
                [FromBody] CreateComponentUsefulLinkDto request,
                CancellationToken cancellationToken)
        {
            var input = new CreateComponentUsefulLinkCommand
            {
                ComponentId = request.ComponentId,
                Title = request.Title,
                Url = request.Url,
                CreatedBy = request.CreatedBy,
                PerformedBy = request.PerformedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<ComponentUsefulLinkDto>>(
                link => ComponentUsefulLinkDto.FromDomainModel(link),
                e => e.ToObjectResult());
        }

        [HttpPut]
        public async Task<ActionResult<ComponentUsefulLinkDto>> Update(
            [FromBody] UpdateComponentUsefulLinkDto request,
            CancellationToken cancellationToken)
        {
            var input = new UpdateComponentUsefulLinkCommand
            {
                Id = request.Id,
                Title = request.Title,
                Url = request.Url,
                UpdatedBy = request.UpdatedBy,
                PerformedBy = request.PerformedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<ComponentUsefulLinkDto>>(
                link => ComponentUsefulLinkDto.FromDomainModel(link),
                e => e.ToObjectResult());
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(
            [FromRoute] Guid id,
            [FromQuery] Guid performedBy,
            CancellationToken cancellationToken)
        {
            var input = new DeleteComponentUsefulLinkCommand(id, performedBy);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
