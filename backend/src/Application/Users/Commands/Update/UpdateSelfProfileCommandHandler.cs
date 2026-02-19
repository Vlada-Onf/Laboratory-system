using Application.Common.Interfaces.Repositories;
using Application.Users.Exceptions;
using Domain.Users;
using LanguageExt;
using MediatR;

namespace Application.Users.Commands.Update
{
    public class UpdateSelfProfileCommandHandler(
        IUserRepository userRepository)
        : IRequestHandler<UpdateSelfProfileCommand, Either<UserException, User>>
    {
        public async Task<Either<UserException, User>> Handle(
            UpdateSelfProfileCommand request,
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
            UpdateSelfProfileCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                user.UpdateProfile(request.FirstName, request.LastName, request.PhotoUrl);
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
