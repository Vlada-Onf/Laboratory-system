using Api.Dtos;
using Api.Modules.Errors;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Queries;
using Application.Components.Commands.Create;
using Application.Components.Commands.Delete;
using Application.Components.Commands.Update;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("components")]
    public class ComponentsController : ControllerBase
    {
        private readonly IComponentQueries _componentQueries;
        private readonly ISender _sender;
        private readonly IFileStorageService _fileStorage;

        public ComponentsController(
            IComponentQueries componentQueries,
            ISender sender,
            IFileStorageService fileStorage)
        {
            _componentQueries = componentQueries;
            _sender = sender;
            _fileStorage = fileStorage;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ComponentDto>>> GetComponents(
            CancellationToken cancellationToken)
        {
            var components = await _componentQueries.GetAllAsync(cancellationToken);

            return components
                .Select(ComponentDto.FromDomainModel)
                .ToList();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ComponentDto>> GetComponentById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var componentOption = await _componentQueries.GetByIdAsync(
                new Domain.Components.ComponentId(id),
                cancellationToken);

            return componentOption.Match<ActionResult<ComponentDto>>(
                c => ComponentDto.FromDomainModel(c),
                () => NotFound());
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<ComponentDto>> CreateComponent(
            [FromForm] CreateComponentDto request,
            IFormFile image,
            CancellationToken cancellationToken)
        {
            if (image is null || image.Length == 0)
                return BadRequest("Image is required");

            await using var stream = image.OpenReadStream();
            var photoUrl = await _fileStorage.UploadAsync(
                stream,
                image.FileName,
                image.ContentType,
                cancellationToken);

            var input = new CreateComponentCommand
            {
                CategoryId = request.CategoryId,
                Name = request.Name,
                Description = request.Description,
                Quantity = request.Quantity,
                Price = request.Price,
                PhotoUrl = photoUrl,
                SupplierLink = request.SupplierLink,
                DocumentationLink = request.DocumentationLink,
                TagIds = request.TagIds,
                CreatedBy = request.CreatedBy,
                PerformedBy = request.CreatedBy
            };

            var result = await _sender.Send(input, cancellationToken);

            return result.Match<ActionResult<ComponentDto>>(
                c => ComponentDto.FromDomainModel(c),
                e => e.ToObjectResult());
        }

        [HttpPut]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<ComponentDto>> UpdateComponent(
            [FromForm] UpdateComponentDto request,
            IFormFile? image,
            CancellationToken cancellationToken)
        {
            var componentOption = await _componentQueries.GetByIdAsync(
                new Domain.Components.ComponentId(request.Id),
                cancellationToken);

            if (componentOption.IsNone)
                return NotFound();

            var component = componentOption.First();
            var photoUrl = component.PhotoUrl;

            if (image is not null && image.Length > 0)
            {
                await using var stream = image.OpenReadStream();
                photoUrl = await _fileStorage.UploadAsync(
                    stream,
                    image.FileName,
                    image.ContentType,
                    cancellationToken);
            }

            var input = new UpdateComponentCommand
            {
                Id = request.Id,
                CategoryId = request.CategoryId,
                Name = request.Name,
                Description = request.Description,
                Quantity = request.Quantity,
                Price = request.Price,
                PhotoUrl = photoUrl,
                SupplierLink = request.SupplierLink,
                DocumentationLink = request.DocumentationLink,
                LastUpdatedBy = request.LastUpdatedBy,
                PerformedBy = request.LastUpdatedBy,
                TagIds = request.TagIds
            };

            var result = await _sender.Send(input, cancellationToken);

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

            var result = await _sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
