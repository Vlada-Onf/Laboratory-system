using Api.Dtos;
using Api.Modules.Errors;
using Application.Roles.Commands.Create;
using Application.Roles.Commands.Delete;
using Application.Roles.Commands.Update;
using Application.Roles.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("roles")]
    public class RolesController(ISender sender) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<RoleDto>>> GetAll(
            CancellationToken cancellationToken)
        {
            var roles = await sender.Send(new GetAllRolesQuery(), cancellationToken);

            return roles
                .Select(RoleDto.FromDomainModel)
                .ToList();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<RoleDto>> GetById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var result = await sender.Send(new GetRoleByIdQuery(id), cancellationToken);

            return result.Match<ActionResult<RoleDto>>(
                r => RoleDto.FromDomainModel(r),
                () => NotFound());
        }

        [HttpGet("by-name")]
        public async Task<ActionResult<RoleDto>> GetByName(
            [FromQuery] string name,
            CancellationToken cancellationToken)
        {
            var result = await sender.Send(new GetRoleByNameQuery(name), cancellationToken);

            return result.Match<ActionResult<RoleDto>>(
                r => RoleDto.FromDomainModel(r),
                () => NotFound());
        }

        [HttpPost]
        public async Task<ActionResult<RoleDto>> Create(
            [FromBody] CreateRoleDto request,
            CancellationToken cancellationToken)
        {
            var input = new CreateRoleCommand
            {
                Name = request.Name
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<RoleDto>>(
                r => RoleDto.FromDomainModel(r),
                e => e.ToObjectResult());
        }

        [HttpPut]
        public async Task<ActionResult<RoleDto>> Update(
            [FromBody] UpdateRoleDto request,
            CancellationToken cancellationToken)
        {
            var input = new UpdateRoleCommand
            {
                Id = request.Id,
                Name = request.Name
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<RoleDto>>(
                r => RoleDto.FromDomainModel(r),
                e => e.ToObjectResult());
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var input = new DeleteRoleCommand(id);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
