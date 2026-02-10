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
        : ComponentException(componentId, $"Компонент вже існує з ID {componentId}");

    public class ComponentNotFoundException(ComponentId componentId)
        : ComponentException(componentId, $"Компонент не знайдено з ID {componentId}");

    public class ComponentCategoryNotFoundException(ComponentId componentId)
        : ComponentException(componentId, $"Категорію для компонента {componentId} не знайдено");

    public class UnhandledComponentException(ComponentId componentId, Exception? innerException = null)
        : ComponentException(componentId, "Неочікувана помилка", innerException);
}
