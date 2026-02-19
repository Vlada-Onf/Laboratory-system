using Api.Dtos;
using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers
{
    [ApiController]
    [Route("me")]
    [Authorize]
    public class UserProfileController : ControllerBase
    {
        private readonly IUserQueries _userQueries;
        private readonly IUserRepository _userRepository;

        public UserProfileController(
            IUserQueries userQueries,
            IUserRepository userRepository)
        {
            _userQueries = userQueries;
            _userRepository = userRepository;
        }
        private async Task<User?> GetCurrentUserAsync(CancellationToken ct)
        {
            var clerkId =
                User.FindFirstValue("sub") ??
                User.FindFirstValue("user_id");

            Console.WriteLine($"🔍 Current user ClerkId: {clerkId}");

            if (string.IsNullOrWhiteSpace(clerkId))
                return null;

            var option = await _userQueries.GetByClerkIdAsync(clerkId, ct);
            if (option.IsNone)
            {
                Console.WriteLine("❌ User with this ClerkId not found in DB");
                return null;
            }

            return option.First();
        }

        [HttpGet]
        public async Task<ActionResult<UserProfileDto>> GetMyProfile(
            CancellationToken cancellationToken)
        {
            var user = await GetCurrentUserAsync(cancellationToken);
            if (user is null)
                return Unauthorized("User not found");

            return UserProfileDto.FromDomainModel(user);
        }

        [HttpPut]
        public async Task<ActionResult<UserProfileDto>> UpdateMyProfile(
            [FromBody] UpdateSelfProfileDto request,
            CancellationToken cancellationToken)
        {
            var user = await GetCurrentUserAsync(cancellationToken);
            if (user is null)
                return Unauthorized("User not found");

            user.UpdateProfile(request.FirstName, request.LastName, request.PhotoUrl);

            var updated = await _userRepository.UpdateAsync(user, cancellationToken);

            return UserProfileDto.FromDomainModel(updated);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteMyAccount(
            CancellationToken cancellationToken)
        {
            var user = await GetCurrentUserAsync(cancellationToken);
            if (user is null)
                return Unauthorized("User not found");

            // Варіант 1: м'яке видалення → деактивувати
            user.Deactivate();
            await _userRepository.UpdateAsync(user, cancellationToken);

            // Варіант 2 (якщо маєш метод DeleteAsync):
            // await _userRepository.DeleteAsync(user, cancellationToken);

            return NoContent();
        }
    }
}
