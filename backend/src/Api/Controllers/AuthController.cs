using Api.Dtos;
using Application.Users.Queries;
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

            var clerkId =
                User.FindFirstValue("sub") ??
                User.FindFirstValue("user_id");

            if (string.IsNullOrWhiteSpace(clerkId))
            {
                return Unauthorized("Invalid token claims: missing clerk id");
            }

            var query = new GetUserByClerkIdQuery(clerkId);
            var userOption = await _mediator.Send(query, cancellationToken);

            if (userOption.IsNone)
            {
                return NotFound("User not found in database");
            }

            var user = userOption.First();

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
