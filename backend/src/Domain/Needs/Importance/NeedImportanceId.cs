namespace Domain.Needs.Importance
{
    public record NeedImportanceId(Guid Value)
    {
        public static NeedImportanceId Empty() => new(Guid.Empty);
        public static NeedImportanceId New() => new(Guid.NewGuid());
        public override string ToString() => Value.ToString();
    }

}
