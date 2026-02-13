using Domain.Schematics.Schematics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Schematics.Exceptions
{
    public abstract class SchematicException(
            SchematicId id,
            string message,
            Exception? innerException = null)
            : Exception(message, innerException)
    {
        public SchematicId Id { get; } = id;
    }

    public sealed class SchematicNotFoundException(SchematicId id)
        : SchematicException(id, $"Schematic not found under id {id}");

    public sealed class UnhandledSchematicException(
        SchematicId id,
        Exception? innerException = null)
        : SchematicException(id, "Unexpected error occurred", innerException);
}
