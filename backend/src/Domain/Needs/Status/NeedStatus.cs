namespace Domain.Needs.Status
{
    public class NeedStatus
    {
        public NeedStatusId Id { get; }
        public string Name { get; private set; }
        public string? Description { get; private set; }

        public DateTime CreatedAt { get; }

        private NeedStatus(
            NeedStatusId id,
            string name,
            string? description,
            DateTime createdAt)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name не може бути порожнім");

            Id = id;
            Name = name;
            Description = description;
            CreatedAt = createdAt;
        }

        public static NeedStatus Create(string name, string? description = null)
            => new(NeedStatusId.New(), name, description, DateTime.UtcNow);

        public void Update(string name, string? description)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name не може бути порожнім");

            Name = name;
            Description = description;
        }
    }
}
