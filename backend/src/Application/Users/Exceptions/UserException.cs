using Domain.Users;

namespace Application.Users.Exceptions
{
    public abstract class UserException : Exception
    {
        public UserId UserId { get; }

        protected UserException(UserId userId, string message)
            : base(message)
        {
            UserId = userId;
        }
    }

    public sealed class UserNotFoundException : UserException
    {
        public UserNotFoundException(UserId userId)
            : base(userId, $"User with id {userId.Value} not found.")
        {
        }
    }

    public sealed class UserAlreadyExistsException : UserException
    {
        public UserAlreadyExistsException(UserId userId, string email)
            : base(userId, $"User with email {email} already exists.")
        {
        }
    }
    public sealed class UnhandledUserException : UserException
    {
        public UnhandledUserException(UserId userId, Exception inner)
            : base(userId, $"Unhandled user exception: {inner.Message}")
        {
        }
    }
}
