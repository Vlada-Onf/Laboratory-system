namespace Domain.DamagedComponents.Reason
{
    public record DamagedComponentReasonId(Guid Value)
    {
        public static DamagedComponentReasonId New() => new(Guid.NewGuid());
        public static DamagedComponentReasonId Empty() => new(Guid.Empty);
        public override string ToString() => Value.ToString();
    }
}
