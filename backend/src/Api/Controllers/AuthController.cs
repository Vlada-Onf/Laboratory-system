using Api.Dtos;
using Application.Users.Commands.SyncUserFromClerk;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserDto>> GetCurrentUser(CancellationToken cancellationToken)
        {
            Console.WriteLine("========== /auth/me ==========");

            foreach (var claim in User.Claims)
            {
                Console.WriteLine($"CLAIM: {claim.Type} = {claim.Value}");
            }

            var userId =
                User.FindFirstValue("sub") ??
                User.FindFirstValue("user_id");

            var email =
                User.FindFirstValue("email") ??              // Clerk JWT template
                User.FindFirstValue(ClaimTypes.Email) ??    // стандарт .NET
                User.FindFirstValue("email_address");       // fallback

            var firstName =
                User.FindFirstValue("first_name") ??
                User.FindFirstValue("given_name") ??
                "";

            var lastName =
                User.FindFirstValue("last_name") ??
                User.FindFirstValue("family_name") ??
                "";

            Console.WriteLine($"Resolved user:");
            Console.WriteLine($"sub = {userId}");
            Console.WriteLine($"email = {email}");
            Console.WriteLine($"firstName = {firstName}");
            Console.WriteLine($"lastName = {lastName}");

            if (userId is null || email is null)
                return Unauthorized("Invalid token claims");

            var command = new SyncUserFromClerkCommand(
                ClerkId: userId,
                Email: email,
                FirstName: firstName,
                LastName: lastName
            );

            var user = await _mediator.Send(command, cancellationToken);

            var dto = new UserDto(
                Id: user.Id.Value,
                Email: user.Email,
                FirstName: user.FirstName,
                LastName: user.LastName,
                PhotoUrl: user.PhotoUrl,
                RoleId: user.RoleId.Value);

            return Ok(dto);
        }
    }
}
