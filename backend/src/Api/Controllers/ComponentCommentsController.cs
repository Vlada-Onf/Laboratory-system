using Api.Dtos;
using Api.Modules.Errors;
using Application.Comment.Commands.Create;
using Application.Comment.Commands.Delete;
using Application.Comment.Commands.Update;
using Application.Comment.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("component-comments")]
    public class ComponentCommentsController(ISender sender) : ControllerBase
    {
        // GET /component-comments/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ComponentCommentDto>> GetById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var result = await sender.Send(new GetComponentCommentByIdQuery(id), cancellationToken);

            return result.Match<ActionResult<ComponentCommentDto>>(
                c => ComponentCommentDto.FromDomainModel(c),
                () => NotFound());
        }

        // GET /component-comments/by-component/{componentId}
        [HttpGet("by-component/{componentId:guid}")]
        public async Task<ActionResult<IReadOnlyList<ComponentCommentDto>>> GetByComponentId(
            [FromRoute] Guid componentId,
            CancellationToken cancellationToken)
        {
            var comments = await sender.Send(new GetCommentsByComponentIdQuery(componentId), cancellationToken);

            return comments
                .Select(ComponentCommentDto.FromDomainModel)
                .ToList();
        }

        // POST /component-comments
        [HttpPost]
        public async Task<ActionResult<ComponentCommentDto>> Create(
            [FromBody] CreateComponentCommentDto request,
            CancellationToken cancellationToken)
        {
            var input = new CreateComponentCommentCommand
            {
                ComponentId = request.ComponentId,
                Content = request.Content,
                CreatedBy = request.CreatedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<ComponentCommentDto>>(
                c => ComponentCommentDto.FromDomainModel(c),
                e => e.ToObjectResult());
        }

        // PUT /component-comments
        [HttpPut]
        public async Task<ActionResult<ComponentCommentDto>> Update(
            [FromBody] UpdateComponentCommentDto request,
            CancellationToken cancellationToken)
        {
            var input = new UpdateComponentCommentCommand
            {
                Id = request.Id,
                Content = request.Content
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<ComponentCommentDto>>(
                c => ComponentCommentDto.FromDomainModel(c),
                e => e.ToObjectResult());
        }

        // DELETE /component-comments/{id}
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var input = new DeleteComponentCommentCommand(id);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
