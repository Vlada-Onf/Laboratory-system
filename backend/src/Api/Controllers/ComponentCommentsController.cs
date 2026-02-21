using Api.Dtos;
using Api.Modules.Errors;
using Application.Comment.Commands.Create;
using Application.Comment.Commands.Delete;
using Application.Comment.Commands.Update;
using Application.Comment.Queries;
using Application.Common.Interfaces.Queries;
using Domain.Components.Comment;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("component-comments")]
    public class ComponentCommentsController : ControllerBase
    {
        private readonly ISender _sender;
        private readonly IUserQueries _userQueries;

        public ComponentCommentsController(
            ISender sender,
            IUserQueries userQueries)
        {
            _sender = sender;
            _userQueries = userQueries;
        }

        // GET /component-comments/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ComponentCommentDto>> GetById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var option = await _sender.Send(new GetComponentCommentByIdQuery(id), cancellationToken);
            if (option.IsNone)
                return NotFound();

            var comment = option.First();

            var authorOpt = await _userQueries.GetByIdAsync(comment.CreatedBy, cancellationToken);
            if (authorOpt.IsNone)
                return NotFound("Author not found");

            var author = authorOpt.First();
            return ComponentCommentDto.FromDomainModel(comment, author);
        }

        // GET /component-comments/by-component/{componentId}
        [HttpGet("by-component/{componentId:guid}")]
        public async Task<ActionResult<IReadOnlyList<ComponentCommentDto>>> GetByComponentId(
            [FromRoute] Guid componentId,
            CancellationToken cancellationToken)
        {
            var comments = await _sender.Send(
                new GetCommentsByComponentIdQuery(componentId),
                cancellationToken);

            var result = new List<ComponentCommentDto>(comments.Count);

            foreach (var c in comments)
            {
                var authorOpt = await _userQueries.GetByIdAsync(c.CreatedBy, cancellationToken);
                if (authorOpt.IsNone)
                    continue;

                var author = authorOpt.First();
                result.Add(ComponentCommentDto.FromDomainModel(c, author));
            }

            return result;
        }

        // POST /component-comments
        [HttpPost]
        public async Task<ActionResult<ComponentCommentDto>> Create(
            [FromBody] CreateComponentCommentDto request,
            CancellationToken cancellationToken)
        {
            var command = new CreateComponentCommentCommand
            {
                ComponentId = request.ComponentId,
                Content = request.Content,
                CreatedBy = request.CreatedBy
            };

            var result = await _sender.Send(command, cancellationToken);

            return result.Match<ActionResult<ComponentCommentDto>>(
                c =>
                {
                    // після створення тягнемо автора
                    return BuildDtoWithAuthorAsync(c, cancellationToken).Result;
                },
                e => e.ToObjectResult());
        }

        // PUT /component-comments
        [HttpPut]
        public async Task<ActionResult<ComponentCommentDto>> Update(
            [FromBody] UpdateComponentCommentDto request,
            CancellationToken cancellationToken)
        {
            var command = new UpdateComponentCommentCommand
            {
                Id = request.Id,
                Content = request.Content
            };

            var result = await _sender.Send(command, cancellationToken);

            return result.Match<ActionResult<ComponentCommentDto>>(
                c =>
                {
                    return BuildDtoWithAuthorAsync(c, cancellationToken).Result;
                },
                e => e.ToObjectResult());
        }

        // DELETE /component-comments/{id}
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var command = new DeleteComponentCommentCommand(id);

            var result = await _sender.Send(command, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }

        // допоміжний метод
        private async Task<ComponentCommentDto> BuildDtoWithAuthorAsync(
            ComponentComment comment,
            CancellationToken ct)
        {
            var authorOpt = await _userQueries.GetByIdAsync(comment.CreatedBy, ct);
            var author = authorOpt.IsSome
                ? authorOpt.First()
                : throw new InvalidOperationException("Author not found");

            return ComponentCommentDto.FromDomainModel(comment, author);
        }
    }
}
