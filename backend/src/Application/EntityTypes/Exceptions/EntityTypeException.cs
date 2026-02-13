using Domain.History.EntityTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.EntityTypes.Exceptions
{
    public abstract class EntityTypeException(
         EntityTypeId entityTypeId,
         string message,
         Exception? innerException = null)
         : Exception(message, innerException)
    {
        public EntityTypeId EntityTypeId { get; } = entityTypeId;
    }

    public sealed class EntityTypeNotFoundException(EntityTypeId entityTypeId)
        : EntityTypeException(entityTypeId, $"Entity type not found under id {entityTypeId}");

    public sealed class EntityTypeAlreadyExistException(EntityTypeId entityTypeId)
        : EntityTypeException(entityTypeId, $"Entity type already exists under id {entityTypeId}");

    public sealed class UnhandledEntityTypeException(EntityTypeId entityTypeId, Exception? innerException = null)
        : EntityTypeException(entityTypeId, "Unexpected error occurred", innerException);
}