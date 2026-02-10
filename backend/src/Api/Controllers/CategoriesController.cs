using Api.Dtos;
using Api.Modules.Errors;
using Application.Categories.Commands.Create;
using Application.Categories.Commands.Delete;
using Application.Categories.Commands.Update;
using Application.Common.Interfaces.Queries;
using Domain.Categories;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("categories")]
    public class CategoriesController(
        ICategoryQueries categoryQueries,
        ISender sender) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<CategoryDto>>> GetCategories(
            CancellationToken cancellationToken)
        {
            var categories = await categoryQueries.GetAllAsync(cancellationToken);
            return categories
                .Select(CategoryDto.FromDomainModel)
                .ToList();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<CategoryDto>> GetCategoryById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var categoryOption = await categoryQueries.GetByIdAsync(new CategoryId(id), cancellationToken);

            return categoryOption.Match<ActionResult<CategoryDto>>(
                c => CategoryDto.FromDomainModel(c),
                () => NotFound());
        }

        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateCategory(
            [FromBody] CreateCategoryDto request,
            CancellationToken cancellationToken)
        {
            var input = new CreateCategoryCommand
            {
                Name = request.Name,
                Description = request.Description,
                PhotoUrl = request.PhotoUrl,
                CardColor = request.CardColor,
                CreatedBy = request.CreatedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<CategoryDto>>(
                c => CategoryDto.FromDomainModel(c),
                e => e.ToObjectResult());
        }

        [HttpPut]
        public async Task<ActionResult<CategoryDto>> UpdateCategory(
            [FromBody] UpdateCategoryDto request,
            CancellationToken cancellationToken)
        {
            var input = new UpdateCategoryCommand
            {
                Id = request.Id,
                Name = request.Name,
                Description = request.Description,
                PhotoUrl = request.PhotoUrl,
                CardColor = request.CardColor,
                LastUpdatedBy = request.LastUpdatedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<CategoryDto>>(
                c => CategoryDto.FromDomainModel(c),
                e => e.ToObjectResult());
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> DeleteCategory(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var input = new DeleteCategoryCommand(id);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
