using Api.Dtos;
using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Roles;
using Domain.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers
{
    [ApiController]
    [Route("admin/users")]
    [Authorize(Roles = "SuperAdmin")]
    public class AdminUsersController : ControllerBase
    {
        private readonly IUserQueries _userQueries;
        private readonly IUserRepository _userRepository;
        private readonly IRoleQueries _roleQueries;

        public AdminUsersController(
            IUserQueries userQueries,
            IUserRepository userRepository,
            IRoleQueries roleQueries)
        {
            _userQueries = userQueries;
            _userRepository = userRepository;
            _roleQueries = roleQueries;
        }


        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<AdminUserDto>>> GetUsers(
            CancellationToken cancellationToken)
        {
            var users = await _userQueries.GetAllAsync(cancellationToken);

            return users
                .Select(AdminUserDto.FromDomainModel)
                .ToList();
        }


        [HttpGet("{id:guid}")]
        public async Task<ActionResult<AdminUserDto>> GetUserById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var option = await _userQueries.GetByIdAsync(new UserId(id), cancellationToken);

            return option.Match<ActionResult<AdminUserDto>>(
                u => AdminUserDto.FromDomainModel(u),
                () => NotFound());
        }

        [HttpPut]
        public async Task<ActionResult<AdminUserDto>> UpdateUser(
            [FromBody] UpdateUserByAdminDto request,
            CancellationToken cancellationToken)
        {
            Console.WriteLine("===== PUT /admin/users START =====");
            Console.WriteLine($"request.Id: {request.Id}");
            Console.WriteLine($"FirstName: {request.FirstName}, LastName: {request.LastName}");
            Console.WriteLine($"RoleId: {request.RoleId}, IsActive: {request.IsActive}");

            var option = await _userQueries.GetByIdAsync(new UserId(request.Id), cancellationToken);
            if (option.IsNone)
                return NotFound("User not found");

            var user = option.First();

            if (request.FirstName is not null || request.LastName is not null)
            {
                var newFirstName = request.FirstName ?? user.FirstName;
                var newLastName = request.LastName ?? user.LastName;

                user.UpdateProfile(newFirstName, newLastName, user.PhotoUrl);
            }

            if (request.RoleId.HasValue)
            {
                var roleOption = await _roleQueries.GetByIdAsync(new RoleId(request.RoleId.Value), cancellationToken);
                if (roleOption.IsNone)
                    return BadRequest("Role not found");

                user.UpdateRole(new RoleId(request.RoleId.Value));
            }

            if (request.IsActive.HasValue)
            {
                if (request.IsActive.Value)
                    user.Activate();
                else
                    user.Deactivate();
            }

            var updated = await _userRepository.UpdateAsync(user, cancellationToken);

            return AdminUserDto.FromDomainModel(updated);
        }

        [HttpPost("{id:guid}/block")]
        public async Task<ActionResult> BlockUser(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var option = await _userQueries.GetByIdAsync(new UserId(id), cancellationToken);
            if (option.IsNone)
                return NotFound();

            var user = option.First();
            if (!user.IsActive)
                return NoContent();

            user.Deactivate();
            await _userRepository.UpdateAsync(user, cancellationToken);

            return NoContent();
        }

        [HttpPost("{id:guid}/unblock")]
        public async Task<ActionResult> UnblockUser(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var option = await _userQueries.GetByIdAsync(new UserId(id), cancellationToken);
            if (option.IsNone)
                return NotFound();

            var user = option.First();
            if (user.IsActive)
                return NoContent();

            user.Activate();
            await _userRepository.UpdateAsync(user, cancellationToken);

            return NoContent();
        }
    }
}
