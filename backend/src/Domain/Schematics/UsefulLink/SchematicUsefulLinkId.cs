namespace Domain.Schematics.UsefulLink
{
    public record SchematicUsefulLinkId(Guid Value)
    {
        public static SchematicUsefulLinkId New() => new(Guid.NewGuid());
        public static SchematicUsefulLinkId Empty() => new(Guid.Empty);
        public override string ToString() => Value.ToString();
    }
}
