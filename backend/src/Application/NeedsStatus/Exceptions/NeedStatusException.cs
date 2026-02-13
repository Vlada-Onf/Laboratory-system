using Domain.Needs.Status;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.NeedsStatus.Exceptions
{
    public abstract class NeedStatusException(
            NeedStatusId id,
            string message,
            Exception? innerException = null)
            : Exception(message, innerException)
    {
        public NeedStatusId Id { get; } = id;
    }

    public sealed class NeedStatusNotFoundException(NeedStatusId id)
        : NeedStatusException(id, $"Need status not found under id {id}");

    public sealed class NeedStatusAlreadyExistException(NeedStatusId id)
        : NeedStatusException(id, $"Need status already exists under id {id}");

    public sealed class UnhandledNeedStatusException(
        NeedStatusId id,
        Exception? innerException = null)
        : NeedStatusException(id, "Unexpected error occurred", innerException);
}
