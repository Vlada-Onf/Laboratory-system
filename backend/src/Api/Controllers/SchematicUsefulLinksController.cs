using Api.Dtos;
using Api.Modules.Errors;
using Application.SchematicsUsefulLinks.Commands.Create;
using Application.SchematicsUsefulLinks.Commands.Delete;
using Application.SchematicsUsefulLinks.Commands.Update;
using Application.SchematicsUsefulLinks.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("schematic-links")]
    [Authorize]
    public class SchematicUsefulLinksController(ISender sender) : ControllerBase
    {
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<SchematicUsefulLinkDto>> GetById(
            [FromRoute] Guid id,
            CancellationToken ct)
        {
            var result = await sender.Send(new GetSchematicUsefulLinkByIdQuery(id), ct);

            return result.Match<ActionResult<SchematicUsefulLinkDto>>(
                l => SchematicUsefulLinkDto.FromDomainModel(l),
                () => NotFound());
        }

        [HttpGet("by-schematic/{schematicId:guid}")]
        public async Task<ActionResult<IReadOnlyList<SchematicUsefulLinkDto>>> GetBySchematicId(
            [FromRoute] Guid schematicId,
            CancellationToken ct)
        {
            var links = await sender.Send(new GetSchematicUsefulLinksBySchematicIdQuery(schematicId), ct);

            return links
                .Select(SchematicUsefulLinkDto.FromDomainModel)
                .ToList();
        }

        [HttpPost]
        public async Task<ActionResult<SchematicUsefulLinkDto>> Create(
            [FromBody] CreateSchematicUsefulLinkDto request,
            CancellationToken ct)
        {
            var command = new CreateSchematicUsefulLinkCommand
            {
                SchematicId = request.SchematicId,
                Title = request.Title,
                Url = request.Url,
                CreatedBy = request.CreatedBy,
                PerformedBy = request.PerformedBy
            };

            var result = await sender.Send(command, ct);

            return result.Match<ActionResult<SchematicUsefulLinkDto>>(
                l => SchematicUsefulLinkDto.FromDomainModel(l),
                e => e.ToObjectResult());
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<SchematicUsefulLinkDto>> Update(
            [FromRoute] Guid id,
            [FromBody] UpdateSchematicUsefulLinkDto request,
            CancellationToken ct)
        {
            if (id != request.Id)
                return BadRequest("Mismatched ids");

            var command = new UpdateSchematicUsefulLinkCommand
            {
                Id = request.Id,
                Title = request.Title,
                Url = request.Url,
                UpdatedBy = request.UpdatedBy,
                PerformedBy = request.PerformedBy
            };

            var result = await sender.Send(command, ct);

            return result.Match<ActionResult<SchematicUsefulLinkDto>>(
                l => SchematicUsefulLinkDto.FromDomainModel(l),
                e => e.ToObjectResult());
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(
            [FromRoute] Guid id,
            [FromQuery] Guid performedBy,
            CancellationToken ct)
        {
            var command = new DeleteSchematicUsefulLinkCommand(id, performedBy);
            var result = await sender.Send(command, ct);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }

}
