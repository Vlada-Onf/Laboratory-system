using Application.Common.Interfaces.Repositories;
using Application.Users.Exceptions;
using Domain.Roles;
using Domain.Users;
using LanguageExt;
using MediatR;

namespace Application.Users.Commands.Update
{
    public class UpdateUserByAdminCommandHandler(
        IUserRepository userRepository)
        : IRequestHandler<UpdateUserByAdminCommand, Either<UserException, User>>
    {
        public async Task<Either<UserException, User>> Handle(
            UpdateUserByAdminCommand request,
            CancellationToken cancellationToken)
        {
            var userId = new UserId(request.Id);
            var option = await userRepository.GetByIdAsync(userId, cancellationToken);

            return await option.MatchAsync(
                Some: user => UpdateEntity(user, request, cancellationToken),
                None: () => Task.FromResult<Either<UserException, User>>(
                    new UserNotFoundException(userId)));
        }

        private async Task<Either<UserException, User>> UpdateEntity(
            User user,
            UpdateUserByAdminCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                if (request.FirstName is not null || request.LastName is not null)
                {
                    var newFirstName = request.FirstName ?? user.FirstName;
                    var newLastName = request.LastName ?? user.LastName;
                    user.UpdateProfile(newFirstName, newLastName, user.PhotoUrl);
                }

                if (request.RoleId.HasValue)
                {
                    user.UpdateRole(new RoleId(request.RoleId.Value));
                }

                if (request.IsActive.HasValue)
                {
                    if (request.IsActive.Value)
                        user.Activate();
                    else
                        user.Deactivate();
                }

                var updated = await userRepository.UpdateAsync(user, cancellationToken);
                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledUserException(user.Id, ex);
            }
        }
    }
}
