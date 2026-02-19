using Application.Common.Interfaces.Repositories;
using Application.Users.Exceptions;
using Domain.Users;
using LanguageExt;
using MediatR;

namespace Application.Users.Commands.Delete
{
    public class DeleteUserCommandHandler(
        IUserRepository userRepository)
        : IRequestHandler<DeleteUserCommand, Either<UserException, User>>
    {
        public async Task<Either<UserException, User>> Handle(
            DeleteUserCommand request,
            CancellationToken cancellationToken)
        {
            var userId = new UserId(request.Id);
            var option = await userRepository.GetByIdAsync(userId, cancellationToken);

            return await option.MatchAsync(
                Some: user => DeleteEntity(user, cancellationToken),
                None: () => Task.FromResult<Either<UserException, User>>(
                    new UserNotFoundException(userId)));
        }

        private async Task<Either<UserException, User>> DeleteEntity(
            User user,
            CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await userRepository.DeleteAsync(user, cancellationToken);
                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledUserException(user.Id, ex);
            }
        }
    }
}
