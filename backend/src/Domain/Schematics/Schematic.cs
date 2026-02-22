using Domain.Components;
using Domain.Schematics.Schematics;
using Domain.Schematics.UsefulLink;
using Domain.Users;

namespace Domain.Schematics
{
    public class Schematic
    {
        public SchematicId Id { get; }
        public ComponentId ComponentId { get; private set; }

        public SchematicUsefulLinkId? SchematicUsefulLinkId { get; private set; }

        public string Title { get; private set; }
        public string? Description { get; private set; }
        public string? PhotoUrl { get; private set; }
        public string? DocumentUrl { get; private set; }
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
            SchematicUsefulLinkId? schematicUsefulLinkId,
            UserId createdBy,
            DateTime createdAt,
            UserId? updatedBy = null,
            DateTime? updatedAt = null)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Назва не може бути порожньою");

            Id = id;
            ComponentId = componentId;
            Title = title;
            Description = description;
            PhotoUrl = photoUrl;
            DocumentUrl = documentUrl;
            SchematicUsefulLinkId = schematicUsefulLinkId;
            CreatedBy = createdBy;
            CreatedAt = createdAt;
            UpdatedBy = updatedBy;
            UpdatedAt = updatedAt;
        }

        public static Schematic Create(
            ComponentId componentId,
            string title,
            string? description,
            string? photoUrl,
            string? documentUrl,
            SchematicUsefulLinkId? schematicUsefulLinkId,
            UserId createdBy)
        {
            return new Schematic(
                SchematicId.New(),
                componentId,
                title,
                description,
                photoUrl,
                documentUrl,
                schematicUsefulLinkId,
                createdBy,
                DateTime.UtcNow);
        }

        public void Update(
            string title,
            string? description,
            string? photoUrl,
            string? documentUrl,
            SchematicUsefulLinkId? schematicUsefulLinkId,
            UserId updatedBy)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Назва не може бути порожньою");

            Title = title;
            Description = description;
            PhotoUrl = photoUrl;
            DocumentUrl = documentUrl;
            SchematicUsefulLinkId = schematicUsefulLinkId;
            UpdatedBy = updatedBy;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
