using Api.Dtos;
using Api.Modules.Errors;
using Application.Common.Interfaces;
using Application.Schematics.Commands.Create;
using Application.Schematics.Commands.Delete;
using Application.Schematics.Commands.Update;
using Application.Schematics.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("schematics")]
    public class SchematicsController(ISender sender) : ControllerBase
    {
        // GET /schematics/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<SchematicDto>> GetById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var result = await sender.Send(new GetSchematicByIdQuery(id), cancellationToken);

            return result.Match<ActionResult<SchematicDto>>(
                s => SchematicDto.FromDomainModel(s),
                () => NotFound());
        }

        // GET /schematics/by-component/{componentId}
        [HttpGet("by-component/{componentId:guid}")]
        public async Task<ActionResult<IReadOnlyList<SchematicDto>>> GetByComponentId(
            [FromRoute] Guid componentId,
            CancellationToken cancellationToken)
        {
            var schematics = await sender.Send(
                new GetSchematicsByComponentIdQuery(componentId),
                cancellationToken);

            return schematics
                .Select(SchematicDto.FromDomainModel)
                .ToList();
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<SchematicDto>> Create(
            [FromForm] CreateSchematicDto request,
            IFormFile? image,
            CancellationToken cancellationToken,
            [FromServices] IFileStorageService fileStorage)
        {
            string? photoUrl = request.PhotoUrl;

            if (image is not null && image.Length > 0)
            {
                await using var stream = image.OpenReadStream();
                photoUrl = await fileStorage.UploadAsync(
                    stream,
                    image.FileName,
                    image.ContentType,
                    cancellationToken);
            }

            var input = new CreateSchematicCommand
            {
                ComponentId = request.ComponentId,
                Title = request.Title,
                Description = request.Description,
                PhotoUrl = photoUrl,
                AdditionalLinks = request.AdditionalLinks,
                CreatedBy = request.CreatedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<SchematicDto>>(
                s => SchematicDto.FromDomainModel(s),
                e => e.ToObjectResult());
        }

        [HttpPut]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<SchematicDto>> Update(
            [FromForm] UpdateSchematicDto request,
            IFormFile? image,
            CancellationToken cancellationToken,
            [FromServices] IFileStorageService fileStorage)
        {
            string? photoUrl = request.PhotoUrl;

            if (image is not null && image.Length > 0)
            {
                await using var stream = image.OpenReadStream();
                photoUrl = await fileStorage.UploadAsync(
                    stream,
                    image.FileName,
                    image.ContentType,
                    cancellationToken);
            }

            var input = new UpdateSchematicCommand
            {
                Id = request.Id,
                Title = request.Title,
                Description = request.Description,
                PhotoUrl = photoUrl,
                AdditionalLinks = request.AdditionalLinks,
                UpdatedBy = request.UpdatedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<SchematicDto>>(
                s => SchematicDto.FromDomainModel(s),
                e => e.ToObjectResult());
        }
        // DELETE /schematics/{id}
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var input = new DeleteSchematicCommand(id);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
