namespace Domain.Roles
{
    public record RoleId(Guid Value)
    {
        public static RoleId Empty() => new(Guid.Empty);
        public static RoleId New() => new(Guid.NewGuid());
        public override string ToString() => Value.ToString();
    }
}
