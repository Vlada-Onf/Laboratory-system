using Api.Dtos;
using Api.Modules.Errors;
using Application.Actions.Commands.Create;
using Application.Actions.Commands.Delete;
using Application.Actions.Commands.Update;
using Application.Actions.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("actions")]
    public class ActionsController(ISender sender) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ActionDto>>> GetActions(
            CancellationToken cancellationToken)
        {
            var actions = await sender.Send(new GetAllActionsQuery(), cancellationToken);
            return actions.Select(ActionDto.FromDomainModel).ToList();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ActionDto>> GetActionById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var result = await sender.Send(new GetActionByIdQuery(id), cancellationToken);

            return result.Match<ActionResult<ActionDto>>(
                a => ActionDto.FromDomainModel(a),
                () => NotFound());
        }

        [HttpPost]
        public async Task<ActionResult<ActionDto>> CreateAction(
            [FromBody] CreateActionDto request,
            CancellationToken cancellationToken)
        {
            var input = new CreateActionCommand
            {
                Name = request.Name,
                Description = request.Description
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<ActionDto>>(
                a => ActionDto.FromDomainModel(a),
                e => e.ToObjectResult());
        }

        [HttpPut]
        public async Task<ActionResult<ActionDto>> UpdateAction(
            [FromBody] UpdateActionDto request,
            CancellationToken cancellationToken)
        {
            var input = new UpdateActionCommand
            {
                Id = request.Id,
                Name = request.Name,
                Description = request.Description
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<ActionDto>>(
                a => ActionDto.FromDomainModel(a),
                e => e.ToObjectResult());
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> DeleteAction(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var input = new DeleteActionCommand(id);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
