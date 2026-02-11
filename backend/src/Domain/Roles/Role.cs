namespace Domain.Roles
{
    public class Role
    {
        public RoleId Id { get; }
        public string Name { get; private set; }

        public DateTime CreatedAt { get; }

        private Role(RoleId id, string name, DateTime createdAt)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Назва не може бути порожньою");

            Id = id;
            Name = name;
            CreatedAt = createdAt;
        }

        public static Role Create(string name)
            => new(RoleId.New(), name, DateTime.UtcNow);

        public void Update(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Назва не може бути порожньою");

            Name = name;
        }
    }
}
