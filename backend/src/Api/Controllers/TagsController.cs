using Api.Dtos;
using Api.Modules.Errors;
using Application.Tags.Commands.Create;
using Application.Tags.Commands.Delete;
using Application.Tags.Commands.Update;
using Application.Tags.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("tags")]
    public class TagsController(ISender sender) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<TagDto>>> GetTags(
            CancellationToken cancellationToken)
        {
            var tags = await sender.Send(new GetAllTagsQuery(), cancellationToken);
            return tags.Select(TagDto.FromDomainModel).ToList();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<TagDto>> GetTagById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var result = await sender.Send(new GetTagByIdQuery(id), cancellationToken);

            return result.Match<ActionResult<TagDto>>(
                t => TagDto.FromDomainModel(t),
                () => NotFound());
        }

        [HttpPost]
        public async Task<ActionResult<TagDto>> CreateTag(
            [FromBody] CreateTagDto request,
            CancellationToken cancellationToken)
        {
            var input = new CreateTagCommand
            {
                Name = request.Name,
                Color = request.Color,
                CreatedBy = request.CreatedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<TagDto>>(
                t => TagDto.FromDomainModel(t),
                e => e.ToObjectResult());
        }

        [HttpPut]
        public async Task<ActionResult<TagDto>> UpdateTag(
            [FromBody] UpdateTagDto request,
            CancellationToken cancellationToken)
        {
            var input = new UpdateTagCommand
            {
                Id = request.Id,
                Name = request.Name,
                Color = request.Color
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<TagDto>>(
                t => TagDto.FromDomainModel(t),
                e => e.ToObjectResult());
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> DeleteTag(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var input = new DeleteTagCommand(id);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
