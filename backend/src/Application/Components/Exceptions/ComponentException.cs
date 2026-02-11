using Domain.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Components.Exceptions
{
    public abstract class ComponentException(
        ComponentId componentId,
        string message,
        Exception? innerException = null)
        : Exception(message, innerException)
    {
        public ComponentId ComponentId { get; } = componentId;
    }

    public class ComponentAlreadyExistException(ComponentId componentId)
        : ComponentException(componentId, $"Component already exists under id {componentId}");

    public class ComponentNotFoundException(ComponentId componentId)
        : ComponentException(componentId, $"Component not found under id {componentId}");

    public class ComponentCategoryNotFoundException(ComponentId componentId)
        : ComponentException(componentId, $"Category not found for component {componentId}");

    public class UnhandledComponentException(ComponentId componentId, Exception? innerException = null)
        : ComponentException(componentId, "Unexpected error occurred", innerException);
}
