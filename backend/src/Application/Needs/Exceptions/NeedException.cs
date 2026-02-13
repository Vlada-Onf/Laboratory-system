using Domain.Needs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Needs.Exceptions
{
    public abstract class NeedException(
            NeedId needId,
            string message,
            Exception? innerException = null)
            : Exception(message, innerException)
    {
        public NeedId NeedId { get; } = needId;
    }

    public sealed class NeedNotFoundException(NeedId needId)
        : NeedException(needId, $"Need not found under id {needId}");

    public sealed class UnhandledNeedException(NeedId needId, Exception? innerException = null)
        : NeedException(needId, "Unexpected error occurred", innerException);
}
