using Domain.History.Actions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Actions.Exceptions
{
    public abstract class ActionException(
        ActionId actionId,
        string message,
        Exception? innerException = null)
        : Exception(message, innerException)
    {
        public ActionId ActionId { get; } = actionId;
    }

    public sealed class ActionNotFoundException(ActionId actionId)
        : ActionException(actionId, $"Action not found under id {actionId}");

    public sealed class ActionAlreadyExistException(ActionId actionId)
        : ActionException(actionId, $"Action already exists under id {actionId}");

    public sealed class UnhandledActionException(ActionId actionId, Exception? innerException = null)
        : ActionException(actionId, "Unexpected error occurred", innerException);
}