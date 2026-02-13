using Domain.Components.UsefulLink;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UsefulLink.Exceptions
{
    public abstract class ComponentUsefulLinkException(
            ComponentUsefulLinkId id,
            string message,
            Exception? innerException = null)
            : Exception(message, innerException)
    {
        public ComponentUsefulLinkId Id { get; } = id;
    }

    public sealed class ComponentUsefulLinkNotFoundException(ComponentUsefulLinkId id)
        : ComponentUsefulLinkException(id, $"Component useful link not found under id {id}");

    public sealed class UnhandledComponentUsefulLinkException(
        ComponentUsefulLinkId id,
        Exception? innerException = null)
        : ComponentUsefulLinkException(id, "Unexpected error occurred", innerException);
}
