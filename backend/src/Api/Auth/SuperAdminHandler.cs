using Application.Common.Interfaces.Queries;
using Domain.Roles;
using Microsoft.AspNetCore.Authorization;

namespace Api.Auth
{
    public class SuperAdminHandler : AuthorizationHandler<SuperAdminRequirement>
    {
        private readonly IUserQueries _userQueries;

        public SuperAdminHandler(IUserQueries userQueries)
        {
            _userQueries = userQueries;
        }

        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            SuperAdminRequirement requirement)
        {
            var user = context.User;

            var clerkId =
                user.FindFirst("sub")?.Value ??
                user.FindFirst("user_id")?.Value;

            if (string.IsNullOrWhiteSpace(clerkId))
                return;

            var userOption = await _userQueries.GetByClerkIdAsync(clerkId, CancellationToken.None);
            if (userOption.IsNone)
                return;

            var appUser = userOption.First();

            if (appUser.RoleId == RoleIds.SuperAdmin)
            {
                context.Succeed(requirement);
            }
        }
    }
}
