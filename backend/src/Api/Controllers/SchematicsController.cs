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
            Console.WriteLine($"[SchematicsController] GET /schematics/{id}");

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
            Console.WriteLine($"[SchematicsController] GET /schematics/by-component/{componentId}");

            var schematics = await sender.Send(
                new GetSchematicsByComponentIdQuery(componentId),
                cancellationToken);

            return schematics
                .Select(SchematicDto.FromDomainModel)
                .ToList();
        }

        // POST /schematics
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<SchematicDto>> Create(
            [FromForm] CreateSchematicDto request,
            IFormFile image,
            IFormFile? document,
            CancellationToken cancellationToken,
            [FromServices] IFileStorageService fileStorage)
        {
            Console.WriteLine("[SchematicsController] POST /schematics");
            Console.WriteLine($"[SchematicsController] Request: " +
                              $"ComponentId={request.ComponentId}, " +
                              $"Title={request.Title}, " +
                              $"CreatedBy={request.CreatedBy}, " +
                              $"UsefulLinkId={request.UsefulLinkId}");

            if (image is null || image.Length == 0)
            {
                Console.WriteLine("[SchematicsController] Image is null or empty");
                return BadRequest("Image is required");
            }

            Console.WriteLine($"[SchematicsController] Image: Name={image.FileName}, Size={image.Length}, ContentType={image.ContentType}");

            await using var imageStream = image.OpenReadStream();
            var photoUrl = await fileStorage.UploadAsync(
                imageStream,
                image.FileName,
                image.ContentType,
                cancellationToken);

            Console.WriteLine($"[SchematicsController] Image uploaded. PhotoUrl={photoUrl}");

            string? documentUrl = null;
            if (document is not null && document.Length > 0)
            {
                Console.WriteLine($"[SchematicsController] Document: Name={document.FileName}, Size={document.Length}, ContentType={document.ContentType}");

                await using var docStream = document.OpenReadStream();
                documentUrl = await fileStorage.UploadAsync(
                    docStream,
                    document.FileName,
                    document.ContentType,
                    cancellationToken);

                Console.WriteLine($"[SchematicsController] Document uploaded. DocumentUrl={documentUrl}");
            }
            else
            {
                Console.WriteLine("[SchematicsController] No document provided");
            }

            var input = new CreateSchematicCommand
            {
                ComponentId = request.ComponentId,
                Title = request.Title,
                Description = request.Description,
                PhotoUrl = photoUrl,
                DocumentUrl = documentUrl,
                UsefulLinkId = request.UsefulLinkId,
                CreatedBy = request.CreatedBy
            };

            Console.WriteLine("[SchematicsController] Sending CreateSchematicCommand to MediatR");

            var result = await sender.Send(input, cancellationToken);

            Console.WriteLine("[SchematicsController] CreateSchematicCommand handled");

            return result.Match<ActionResult<SchematicDto>>(
                s =>
                {
                    Console.WriteLine($"[SchematicsController] Created schematic Id={s.Id}");
                    return SchematicDto.FromDomainModel(s);
                },
                e =>
                {
                    Console.WriteLine($"[SchematicsController] Error: {e.GetType().Name} - {e.Message}");
                    return e.ToObjectResult();
                });
        }

        // PUT /schematics
        [HttpPut]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<SchematicDto>> Update(
            [FromForm] UpdateSchematicDto request,
            IFormFile? image,
            IFormFile? document,
            CancellationToken cancellationToken,
            [FromServices] IFileStorageService fileStorage)
        {
            Console.WriteLine("[SchematicsController] PUT /schematics");
            Console.WriteLine($"[SchematicsController] Request: Id={request.Id}, Title={request.Title}, UpdatedBy={request.UpdatedBy}, UsefulLinkId={request.UsefulLinkId}");

            var option = await sender.Send(new GetSchematicByIdQuery(request.Id), cancellationToken);
            if (option.IsNone)
            {
                Console.WriteLine("[SchematicsController] Schematic not found");
                return NotFound();
            }

            var schematic = option.First();

            string? photoUrl = schematic.PhotoUrl;
            string? documentUrl = schematic.DocumentUrl;

            if (image is not null && image.Length > 0)
            {
                Console.WriteLine($"[SchematicsController] New image: Name={image.FileName}, Size={image.Length}, ContentType={image.ContentType}");

                await using var imageStream = image.OpenReadStream();
                photoUrl = await fileStorage.UploadAsync(
                    imageStream,
                    image.FileName,
                    image.ContentType,
                    cancellationToken);

                Console.WriteLine($"[SchematicsController] New photoUrl={photoUrl}");
            }

            if (document is not null && document.Length > 0)
            {
                Console.WriteLine($"[SchematicsController] New document: Name={document.FileName}, Size={document.Length}, ContentType={document.ContentType}");

                await using var docStream = document.OpenReadStream();
                documentUrl = await fileStorage.UploadAsync(
                    docStream,
                    document.FileName,
                    document.ContentType,
                    cancellationToken);

                Console.WriteLine($"[SchematicsController] New documentUrl={documentUrl}");
            }

            var input = new UpdateSchematicCommand
            {
                Id = request.Id,
                Title = request.Title,
                Description = request.Description,
                PhotoUrl = photoUrl,
                DocumentUrl = documentUrl,
                UsefulLinkId = request.UsefulLinkId,
                UpdatedBy = request.UpdatedBy
            };

            Console.WriteLine("[SchematicsController] Sending UpdateSchematicCommand to MediatR");

            var result = await sender.Send(input, cancellationToken);

            Console.WriteLine("[SchematicsController] UpdateSchematicCommand handled");

            return result.Match<ActionResult<SchematicDto>>(
                s =>
                {
                    Console.WriteLine($"[SchematicsController] Updated schematic Id={s.Id}");
                    return SchematicDto.FromDomainModel(s);
                },
                e =>
                {
                    Console.WriteLine($"[SchematicsController] Error: {e.GetType().Name} - {e.Message}");
                    return e.ToObjectResult();
                });
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
