using Domain.Roles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Roles.Exceptions
{
    public abstract class RoleException(
            RoleId roleId,
            string message,
            Exception? innerException = null)
            : Exception(message, innerException)
    {
        public RoleId RoleId { get; } = roleId;
    }

    public sealed class RoleNotFoundException(RoleId roleId)
        : RoleException(roleId, $"Role not found under id {roleId}");

    public sealed class RoleAlreadyExistException(RoleId roleId)
        : RoleException(roleId, $"Role already exists under id {roleId}");

    public sealed class UnhandledRoleException(RoleId roleId, Exception? innerException = null)
        : RoleException(roleId, "Unexpected error occurred", innerException);
}
