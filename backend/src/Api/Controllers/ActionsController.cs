using Api.Dtos;
using Api.Dtos.Api.Dtos;
using Api.Modules.Errors;
using Application.Actions.Commands.Create;
using Application.Actions.Commands.Delete;
using Application.Actions.Commands.Update;
using Application.Actions.Queries;
using Application.Common.Interfaces.Queries;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers
{
    [ApiController]
    [Route("actions")]
    [Authorize]
    public class ActionsController(ISender sender, IUserQueries userQueries) : ControllerBase
    {
        private async Task<User?> GetCurrentUserAsync(CancellationToken ct)
        {
            var clerkId =
                User.FindFirstValue("sub") ??
                User.FindFirstValue("user_id");

            if (string.IsNullOrWhiteSpace(clerkId))
                return null;

            var option = await userQueries.GetByClerkIdAsync(clerkId, ct);
            return option.IsSome ? option.First() : null;
        }
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
        [Authorize]
        public async Task<ActionResult<ActionDto>> CreateAction(
            [FromBody] CreateActionDto request,
            CancellationToken cancellationToken)
        {
            var currentUser = await GetCurrentUserAsync(cancellationToken);
            if (currentUser is null)
                return Unauthorized("User not found");

            var input = new CreateActionCommand
            {
                Name = request.Name,
                Description = request.Description,
                UserId = currentUser.Id.Value
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<ActionDto>>(
                a => ActionDto.FromDomainModel(a),
                e => e.ToObjectResult());
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult<ActionDto>> UpdateAction(
            [FromBody] UpdateActionDto request,
            CancellationToken cancellationToken)
        {
            var currentUser = await GetCurrentUserAsync(cancellationToken);
            if (currentUser is null)
                return Unauthorized("User not found");

            var input = new UpdateActionCommand
            {
                Id = request.Id,
                Name = request.Name,
                Description = request.Description,
                UserId = currentUser.Id.Value
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<ActionDto>>(
                a => ActionDto.FromDomainModel(a),
                e => e.ToObjectResult());
        }

        [HttpDelete("{id:guid}")]
        [Authorize]
        public async Task<ActionResult> DeleteAction(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var currentUser = await GetCurrentUserAsync(cancellationToken);
            if (currentUser is null)
                return Unauthorized("User not found");

            var input = new DeleteActionCommand(id, currentUser.Id.Value);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }

    }
}
