using Domain.History;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.HistoryEntries.Exceptions
{
    public abstract class HistoryException(
            HistoryId historyId,
            string message,
            Exception? innerException = null)
            : Exception(message, innerException)
    {
        public HistoryId HistoryId { get; } = historyId;
    }

    public sealed class UnhandledHistoryException(
        HistoryId historyId,
        Exception? innerException = null)
        : HistoryException(historyId, "Unexpected error occurred", innerException);
}
