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
            Console.WriteLine("[AuthController] /auth/me hit");

            var userId = User.FindFirstValue("sub") ?? User.FindFirstValue("user_id");
            var email = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue("email_address");
            var firstName = User.FindFirstValue("given_name") ?? User.FindFirstValue("first_name") ?? "";
            var lastName = User.FindFirstValue("family_name") ?? User.FindFirstValue("last_name") ?? "";

            Console.WriteLine($"[AuthController] claims: sub={userId}, email={email}, firstName={firstName}, lastName={lastName}");

            if (userId is null || email is null)
                return Unauthorized("Invalid Clerk token claims");

            var command = new SyncUserFromClerkCommand(
                ClerkId: userId,
                Email: email,
                FirstName: firstName,
                LastName: lastName);

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
