using Domain.Schematics.UsefulLink;

namespace Application.SchematicsUsefulLinks.Exceptions
{
    public abstract class SchematicUsefulLinkException(
        SchematicUsefulLinkId id,
        string message,
        Exception? inner = null)
        : Exception(message, inner)
    {
        public SchematicUsefulLinkId Id { get; } = id;
    }

    public sealed class SchematicUsefulLinkNotFoundException(SchematicUsefulLinkId id)
        : SchematicUsefulLinkException(id, $"Schematic useful link not found under id {id}");

    public sealed class UnhandledSchematicUsefulLinkException(
        SchematicUsefulLinkId id,
        Exception? inner = null)
        : SchematicUsefulLinkException(id, "Unexpected error occurred", inner);
}
