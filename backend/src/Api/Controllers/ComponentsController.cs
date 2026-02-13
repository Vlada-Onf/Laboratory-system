using Api.Dtos;
using Api.Modules.Errors;
using Application.Common.Interfaces.Queries;
using Application.Components.Commands.Create;
using Application.Components.Commands.Delete;
using Application.Components.Commands.Update;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("components")]
    public class ComponentsController(
        IComponentQueries componentQueries,
        ISender sender) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ComponentDto>>> GetComponents(
            CancellationToken cancellationToken)
        {
            var components = await componentQueries.GetAllAsync(cancellationToken);

            return components
                .Select(ComponentDto.FromDomainModel)
                .ToList();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ComponentDto>> GetComponentById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var componentOption = await componentQueries.GetByIdAsync(new Domain.Components.ComponentId(id), cancellationToken);

            return componentOption.Match<ActionResult<ComponentDto>>(
                c => ComponentDto.FromDomainModel(c),
                () => NotFound());
        }

        [HttpPost]
        public async Task<ActionResult<ComponentDto>> CreateComponent(
            [FromBody] CreateComponentDto request,
            CancellationToken cancellationToken)
        {
            var input = new CreateComponentCommand
            {
                CategoryId = request.CategoryId,
                Name = request.Name,
                Description = request.Description,
                Quantity = request.Quantity,
                Price = request.Price,
                PhotoUrl = request.PhotoUrl,
                SupplierLink = request.SupplierLink,
                DocumentationLink = request.DocumentationLink,
                TagIds = request.TagIds,
                CreatedBy = request.CreatedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<ComponentDto>>(
                c => ComponentDto.FromDomainModel(c),
                e => e.ToObjectResult());
        }

        [HttpPut]
        public async Task<ActionResult<ComponentDto>> UpdateComponent(
            [FromBody] UpdateComponentDto request,
            CancellationToken cancellationToken)
        {
            var input = new UpdateComponentCommand
            {
                Id = request.Id,
                CategoryId = request.CategoryId,
                Name = request.Name,
                Description = request.Description,
                Quantity = request.Quantity,
                Price = request.Price,
                PhotoUrl = request.PhotoUrl,
                SupplierLink = request.SupplierLink,
                DocumentationLink = request.DocumentationLink,
                LastUpdatedBy = request.LastUpdatedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<ComponentDto>>(
                c => ComponentDto.FromDomainModel(c),
                e => e.ToObjectResult());
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> DeleteComponent(
            [FromRoute] Guid id,
            [FromQuery] Guid deletedBy,
            CancellationToken cancellationToken)
        {
            var input = new DeleteComponentCommand(id, deletedBy);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
