using Domain.DamagedComponents.Reason;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DamagedComponentReasons.Exceptions
{
    public abstract class DamagedComponentReasonException(
        DamagedComponentReasonId reasonId,
        string message,
        Exception? innerException = null)
        : Exception(message, innerException)
    {
        public DamagedComponentReasonId ReasonId { get; } = reasonId;
    }

    public sealed class DamagedComponentReasonNotFoundException(DamagedComponentReasonId reasonId)
        : DamagedComponentReasonException(reasonId, $"Damaged component reason not found under id {reasonId}");

    public sealed class UnhandledDamagedComponentReasonException(
        DamagedComponentReasonId reasonId,
        Exception? innerException = null)
        : DamagedComponentReasonException(reasonId, "Unexpected error occurred", innerException);
}
