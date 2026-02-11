namespace Domain.Needs
{
    public record NeedId(Guid Value)
    {
        public static NeedId Empty() => new(Guid.Empty);
        public static NeedId New() => new(Guid.NewGuid());
        public override string ToString() => Value.ToString();
    }
}
