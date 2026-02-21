using Domain.Components;
using Domain.Schematics.Schematics;
using Domain.Users;

namespace Domain.Schematics
{
    public class Schematic
    {
        public SchematicId Id { get; }
        public ComponentId ComponentId { get; private set; }

        public string Title { get; private set; }
        public string? Description { get; private set; }
        public string? PhotoUrl { get; private set; }
        public string? DocumentUrl { get; private set; }
        public string? AdditionalLinks { get; private set; }

        public UserId CreatedBy { get; }
        public DateTime CreatedAt { get; }
        public UserId? UpdatedBy { get; private set; }
        public DateTime? UpdatedAt { get; private set; }

        private Schematic(
            SchematicId id,
            ComponentId componentId,
            string title,
            string? description,
            string? photoUrl,
            string? documentUrl,
            string? additionalLinks,
            UserId createdBy,
            DateTime createdAt,
            UserId? updatedBy = null,
            DateTime? updatedAt = null)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Назва не може бути порожнім");

            Id = id;
            ComponentId = componentId;
            Title = title;
            Description = description;
            PhotoUrl = photoUrl;
            DocumentUrl = documentUrl;
            AdditionalLinks = additionalLinks;
            CreatedBy = createdBy;
            CreatedAt = createdAt;
            UpdatedBy = updatedBy;
            UpdatedAt = updatedAt;
        }

        public static Schematic Create(
            ComponentId componentId,
            string title,
            string? description = null,
            string? photoUrl = null,
            string? documentUrl = null,
            string? additionalLinks = null,
            UserId? createdBy = null)
        {
            return new Schematic(
                SchematicId.New(),
                componentId,
                title,
                description,
                photoUrl,
                documentUrl,
                additionalLinks,
                createdBy ?? throw new ArgumentException("Дані про користувача не можуть бути порожніми"),
                DateTime.UtcNow);
        }

        public void Update(
            string title,
            string? description,
            string? photoUrl,
            string? documentUrl,
            string? additionalLinks,
            UserId updatedBy)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Назва не може бути порожньою");

            Title = title;
            Description = description;
            PhotoUrl = photoUrl;
            DocumentUrl = documentUrl;
            AdditionalLinks = additionalLinks;
            UpdatedBy = updatedBy;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
