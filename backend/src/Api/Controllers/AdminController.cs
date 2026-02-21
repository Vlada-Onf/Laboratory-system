using Api.Dtos;
using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Application.Users.Commands.Update;
using Application.Users.Commands.Delete;
using Application.Users.Queries;
using Domain.Roles;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers;

[ApiController]
[Route("users")]
[Authorize]
public class AdminController : ControllerBase
{
    private readonly IUserQueries _userQueries;
    private readonly IUserRepository _userRepository;
    private readonly ISender _sender;

    public AdminController(
        IUserQueries userQueries,
        IUserRepository userRepository,
        ISender sender)
    {
        _userQueries = userQueries;
        _userRepository = userRepository;
        _sender = sender;
    }

    private async Task<User?> GetCurrentUserAsync(CancellationToken ct)
    {
        var clerkId =
            User.FindFirstValue("sub") ??
            User.FindFirstValue("user_id");

        if (string.IsNullOrWhiteSpace(clerkId))
            return null;

        var option = await _userQueries.GetByClerkIdAsync(clerkId, ct);
        return option.IsSome ? option.First() : null;
    }

    private static bool IsAdminOrSuperAdmin(User user)
        => user.RoleId == RoleIds.Admin || user.RoleId == RoleIds.SuperAdmin;

    private static bool IsSuperAdmin(User user)
        => user.RoleId == RoleIds.SuperAdmin;
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AdminUserDto>>> GetAllUsers(
        CancellationToken cancellationToken)
    {
        var current = await GetCurrentUserAsync(cancellationToken);
        if (current is null)
            return Unauthorized("User not found");

        if (!IsAdminOrSuperAdmin(current))
            return Forbid();

        var users = await _userQueries.GetAllAsync(cancellationToken);

        return users
            .Select(AdminUserDto.FromDomainModel)
            .ToList();
    }
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserProfileDto>> GetUserById(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var current = await GetCurrentUserAsync(cancellationToken);
        if (current is null)
            return Unauthorized("User not found");

        var option = await _userQueries.GetByIdAsync(new UserId(id), cancellationToken);
        if (option.IsNone)
            return NotFound("User not found");

        var user = option.First();

        if (!IsAdminOrSuperAdmin(current) && current.Id != user.Id)
            return Forbid();

        return UserProfileDto.FromDomainModel(user);
    }
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<UserProfileDto>> UpdateUserByAdmin(
        [FromRoute] Guid id,
        [FromBody] UpdateUserByAdminDto request,
        CancellationToken cancellationToken)
    {
        var current = await GetCurrentUserAsync(cancellationToken);
        if (current is null)
            return Unauthorized("User not found");

        if (!IsAdminOrSuperAdmin(current))
            return Forbid();

        if (!IsSuperAdmin(current) && request.RoleId == RoleIds.SuperAdmin.Value)
            return Forbid("Only SuperAdmin can assign SuperAdmin role");

        var command = new UpdateUserByAdminCommand
        {
            Id = id,
            FirstName = request.FirstName,
            LastName = request.LastName,
            RoleId = request.RoleId,
            IsActive = request.IsActive,
            PerformedBy = current.Id.Value
        };

        var result = await _sender.Send(command, cancellationToken);

        return result.Match<ActionResult<UserProfileDto>>(
            u => UserProfileDto.FromDomainModel(u),
            e => BadRequest(e.Message));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteUser(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var current = await GetCurrentUserAsync(cancellationToken);
        if (current is null)
            return Unauthorized("User not found");

        if (!IsAdminOrSuperAdmin(current))
            return Forbid();

        if (current.Id.Value == id)
            return BadRequest("You cannot delete yourself via this endpoint");

        var command = new DeleteUserCommand(id, current.Id.Value);
        var result = await _sender.Send(command, cancellationToken);

        return result.Match<ActionResult>(
            _ => NoContent(),
            e => BadRequest(e.Message));
    }
}
