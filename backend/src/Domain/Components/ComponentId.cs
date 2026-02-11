namespace Domain.Components
{
    public record ComponentId(Guid Value)
    {
        public static ComponentId New() => new(Guid.NewGuid());
        public static ComponentId Empty() => new(Guid.Empty);
        public override string ToString() => Value.ToString();
    }
}
