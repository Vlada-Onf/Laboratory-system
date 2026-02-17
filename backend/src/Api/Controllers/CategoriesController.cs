using Api.Dtos;
using Api.Modules.Errors;
using Application.Categories.Commands.Create;
using Application.Categories.Commands.Delete;
using Application.Categories.Commands.Update;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Queries;
using Domain.Categories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers
{
    [ApiController]
    [Route("categories")]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryQueries _categoryQueries;
        private readonly ISender _sender;

        public CategoriesController(
            ICategoryQueries categoryQueries,
            ISender sender)
        {
            _categoryQueries = categoryQueries;
            _sender = sender;
        }
        private Guid? GetCurrentUserGuid()
        {
            var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (id is null)
                return null;

            return Guid.TryParse(id, out var guid) ? guid : null;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IReadOnlyList<CategoryDto>>> GetCategories(
            CancellationToken cancellationToken)
        {
            var categories = await _categoryQueries.GetAllAsync(cancellationToken);

            return categories
                .Select(CategoryDto.FromDomainModel)
                .ToList();
        }

        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<ActionResult<CategoryDto>> GetCategoryById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var categoryOption = await _categoryQueries.GetByIdAsync(new CategoryId(id), cancellationToken);

            return categoryOption.Match<ActionResult<CategoryDto>>(
                c => CategoryDto.FromDomainModel(c),
                () => NotFound());
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<CategoryDto>> CreateCategory(
            [FromForm] CreateCategoryDto request,
            IFormFile image,
            CancellationToken cancellationToken,
            [FromServices] IFileStorageService fileStorage)
        {
            var userGuid = GetCurrentUserGuid();
            if (userGuid is null)
                return Unauthorized();

            if (image is null || image.Length == 0)
                return BadRequest("Image is required");

            await using var stream = image.OpenReadStream();
            var photoUrl = await fileStorage.UploadAsync(
                stream,
                image.FileName,
                image.ContentType,
                cancellationToken);

            var input = new CreateCategoryCommand
            {
                Name = request.Name,
                Description = request.Description,
                PhotoUrl = photoUrl,
                CardColor = request.CardColor,
                CreatedBy = userGuid.Value,
                PerformedBy = userGuid.Value
            };

            var result = await _sender.Send(input, cancellationToken);

            return result.Match<ActionResult<CategoryDto>>(
                c =>
                {
                    var dto = CategoryDto.FromDomainModel(c);
                    return CreatedAtAction(nameof(GetCategoryById), new { id = dto.Id }, dto);
                },
                e => e.ToObjectResult());
        }

        [HttpPut]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<CategoryDto>> UpdateCategory(
            [FromForm] UpdateCategoryDto request,
            IFormFile? image,
            CancellationToken cancellationToken,
            [FromServices] IFileStorageService fileStorage)
        {
            var userGuid = GetCurrentUserGuid();
            if (userGuid is null)
                return Unauthorized();
            var categoryOption = await _categoryQueries.GetByIdAsync(new CategoryId(request.Id), cancellationToken);
            if (categoryOption.IsNone)
                return NotFound();

            var category = categoryOption.First();

            string? photoUrl = category.PhotoUrl;

            if (image is not null && image.Length > 0)
            {
                await using var stream = image.OpenReadStream();
                photoUrl = await fileStorage.UploadAsync(
                    stream,
                    image.FileName,
                    image.ContentType,
                    cancellationToken);
            }

            var input = new UpdateCategoryCommand
            {
                Id = request.Id,
                Name = request.Name,
                Description = request.Description,
                PhotoUrl = photoUrl,
                CardColor = request.CardColor,
                LastUpdatedBy = userGuid.Value,
                PerformedBy = userGuid.Value
            };

            var result = await _sender.Send(input, cancellationToken);

            return result.Match<ActionResult<CategoryDto>>(
                c => CategoryDto.FromDomainModel(c),
                e => e.ToObjectResult());
        }
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> DeleteCategory(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var userGuid = GetCurrentUserGuid();
            if (userGuid is null)
                return Unauthorized();

            var input = new DeleteCategoryCommand(id, userGuid.Value);

            var result = await _sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
