using Application.Common.Interfaces.Repositories;
using Domain.Roles;
using Domain.Users;
using MediatR;

namespace Application.Users.Commands.SyncUserFromClerk
{
    public class SyncUserFromClerkCommandHandler(
        IUserRepository userRepository
    ) : IRequestHandler<SyncUserFromClerkCommand, User>
    {
        private const string SuperAdminEmail = "oleksandr.melnychuk@oa.edu.ua";

        public async Task<User> Handle(SyncUserFromClerkCommand request, CancellationToken cancellationToken)
        {
            Console.WriteLine($"[SyncUserFromClerk] Handle: ClerkId={request.ClerkId}, Email={request.Email}");

            var existing = await userRepository.GetByClerkIdAsync(request.ClerkId, cancellationToken);

            var roleId = request.Email.Equals(SuperAdminEmail, StringComparison.OrdinalIgnoreCase)
                ? RoleIds.SuperAdmin
                : RoleIds.Lab;

            if (existing.IsSome)
            {
                Console.WriteLine("[SyncUserFromClerk] Existing user, updating");

                var user = existing.First();
                user.UpdateProfile(request.FirstName, request.LastName, photoUrl: null);
                user.UpdateRole(roleId);
                return await userRepository.UpdateAsync(user, cancellationToken);
            }

            Console.WriteLine("[SyncUserFromClerk] New user, creating");

            var newUser = User.Create(
                clerkId: request.ClerkId,
                email: request.Email,
                firstName: request.FirstName,
                lastName: request.LastName,
                roleId: roleId,
                photoUrl: null);

            return await userRepository.AddAsync(newUser, cancellationToken);
        }
    }
}
