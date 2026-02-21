using Domain.Components.UsefulLink;
using Domain.Schematics.Schematics;
using Domain.Users;

namespace Domain.Schematics.UsefulLink
{
    public class SchematicUsefulLink
    {
        public SchematicUsefulLinkId Id { get; }
        public SchematicId SchematicId { get; }
        public string Title { get; private set; }
        public string Url { get; private set; }
        public UserId CreatedBy { get; }
        public DateTime CreatedAt { get; }
        public UserId? LastUpdatedBy { get; private set; }
        public DateTime? LastUpdatedAt { get; private set; }

        private SchematicUsefulLink(
            SchematicUsefulLinkId id,
            SchematicId schematicId,
            string title,
            string url,
            UserId createdBy,
            DateTime createdAt,
            UserId? lastUpdatedBy,
            DateTime? lastUpdatedAt)
        {
            Id = id;
            SchematicId = schematicId;
            Title = title;
            Url = url;
            CreatedBy = createdBy;
            CreatedAt = createdAt;
            LastUpdatedBy = lastUpdatedBy;
            LastUpdatedAt = lastUpdatedAt;
        }

        public static SchematicUsefulLink New(
            SchematicId schematicId,
            string title,
            string url,
            UserId createdBy)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Назва не може бути порожнім");

            if (string.IsNullOrWhiteSpace(url))
                throw new ArgumentException("Посилання не може бути порожнім");

            return new SchematicUsefulLink(
                SchematicUsefulLinkId.New(),
                schematicId,
                title,
                url,
                createdBy,
                DateTime.UtcNow,
                null,
                null);
        }

        public void Update(string title, string url, UserId updatedBy)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Назва не може бути порожнім");

            if (string.IsNullOrWhiteSpace(url))
                throw new ArgumentException("Посилання не може бути порожнім");

            Title = title;
            Url = url;
            LastUpdatedBy = updatedBy;
            LastUpdatedAt = DateTime.UtcNow;
        }
    }
}
