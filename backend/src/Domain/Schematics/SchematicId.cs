namespace Domain.Schematics.Schematics
{
    public record SchematicId(Guid Value)
    {
        public static SchematicId Empty() => new(Guid.Empty);
        public static SchematicId New() => new(Guid.NewGuid());
        public override string ToString() => Value.ToString();
    }
}
