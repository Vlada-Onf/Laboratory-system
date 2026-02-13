using Domain.Needs.Importance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.NeedsImportance.Exceptions
{
    public abstract class NeedImportanceException(
        NeedImportanceId id,
        string message,
        Exception? innerException = null)
        : Exception(message, innerException)
    {
        public NeedImportanceId Id { get; } = id;
    }

    public sealed class NeedImportanceNotFoundException(NeedImportanceId id)
        : NeedImportanceException(id, $"Need importance not found under id {id}");

    public sealed class NeedImportanceAlreadyExistForLevelException(int level)
        : NeedImportanceException(NeedImportanceId.Empty(),
            $"Need importance already exists for level {level}");

    public sealed class UnhandledNeedImportanceException(
        NeedImportanceId id,
        Exception? innerException = null)
        : NeedImportanceException(id, "Unexpected error occurred", innerException);
}
