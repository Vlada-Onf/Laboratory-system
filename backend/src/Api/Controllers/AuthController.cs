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
            foreach (var claim in User.Claims)
            {
                Console.WriteLine($"CLAIM: {claim.Type} = {claim.Value}");
            }

            var clerkId =
                User.FindFirstValue("sub") ??
                User.FindFirstValue("user_id");

            if (string.IsNullOrWhiteSpace(clerkId))
                return Unauthorized("Invalid token claims: missing clerk id");

            var email =
                User.FindFirstValue("email") ??
                User.FindFirstValue(ClaimTypes.Email) ??
                User.FindFirstValue("email_address");

            if (string.IsNullOrWhiteSpace(email))
                return Unauthorized("Invalid token claims: missing email");

            var firstName =
                User.FindFirstValue("first_name") ??
                User.FindFirstValue("given_name") ??
                "";

            var lastName =
                User.FindFirstValue("last_name") ??
                User.FindFirstValue("family_name") ??
                "";
            var command = new SyncUserFromClerkCommand(
                ClerkId: clerkId,
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
                RoleId: user.RoleId.Value
            );

            return Ok(dto);
        }
    }
}
