using Domain.DamagedComponents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DamagedComponents.Exceptions
{
    public abstract class DamagedComponentException(
        DamagedComponentId damagedComponentId,
        string message,
        Exception? innerException = null)
        : Exception(message, innerException)
    {
        public DamagedComponentId DamagedComponentId { get; } = damagedComponentId;
    }

    public class DamagedComponentNotFoundException(DamagedComponentId id)
        : DamagedComponentException(id, $"Damaged component not found with id {id}");

    public class DamagedComponentReasonNotFoundException(DamagedComponentId id, string? reasonMessage = null)
        : DamagedComponentException(id, reasonMessage ?? $"Reason for damaged component {id} not found");

    public class UnhandledDamagedComponentException(DamagedComponentId id, Exception? innerException = null)
        : DamagedComponentException(id, "Unexpected error occurred", innerException);
}
