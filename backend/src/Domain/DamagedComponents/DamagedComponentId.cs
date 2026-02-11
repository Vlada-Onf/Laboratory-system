namespace Domain.DamagedComponents
{
    public record DamagedComponentId(Guid Value)
    {
        public static DamagedComponentId New() => new(Guid.NewGuid());
        public static DamagedComponentId Empty() => new(Guid.Empty);
        public override string ToString() => Value.ToString();
    }
}
