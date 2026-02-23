using Api.Dtos;
using Api.Modules.Errors;
using Application.EntityTypes.Commands.Create;
using Application.EntityTypes.Commands.Delete;
using Application.EntityTypes.Commands.Update;
using Application.EntityTypes.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("entity-types")]
    [Authorize]
    public class EntityTypesController(ISender sender) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<EntityTypeDto>>> GetAll(
            CancellationToken cancellationToken)
        {
            var types = await sender.Send(new GetAllEntityTypesQuery(), cancellationToken);

            return types
                .Select(EntityTypeDto.FromDomainModel)
                .ToList();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<EntityTypeDto>> GetById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var result = await sender.Send(new GetEntityTypeByIdQuery(id), cancellationToken);

            return result.Match<ActionResult<EntityTypeDto>>(
                t => EntityTypeDto.FromDomainModel(t),
                () => NotFound());
        }

        [HttpPost]
        public async Task<ActionResult<EntityTypeDto>> Create(
            [FromBody] CreateEntityTypeDto request,
            CancellationToken cancellationToken)
        {
            var input = new CreateEntityTypeCommand
            {
                Name = request.Name,
                Description = request.Description
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<EntityTypeDto>>(
                t => EntityTypeDto.FromDomainModel(t),
                e => e.ToObjectResult());
        }

        [HttpPut]
        public async Task<ActionResult<EntityTypeDto>> Update(
            [FromBody] UpdateEntityTypeDto request,
            CancellationToken cancellationToken)
        {
            var input = new UpdateEntityTypeCommand
            {
                Id = request.Id,
                Name = request.Name,
                Description = request.Description
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<EntityTypeDto>>(
                t => EntityTypeDto.FromDomainModel(t),
                e => e.ToObjectResult());
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var input = new DeleteEntityTypeCommand(id);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
