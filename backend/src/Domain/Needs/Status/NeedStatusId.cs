namespace Domain.Needs.Status
{
    public record NeedStatusId(Guid Value)
    {
        public static NeedStatusId Empty() => new(Guid.Empty);
        public static NeedStatusId New() => new(Guid.NewGuid());
        public override string ToString() => Value.ToString();
    }
}
