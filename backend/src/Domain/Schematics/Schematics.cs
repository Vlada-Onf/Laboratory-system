using Domain.Components;
using Domain.Schematics.Schematics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Schematics
{
    public class Schematic
    {
        public SchematicId Id { get; }
        public ComponentId ComponentId { get; private set; }

        public string Title { get; private set; }
        public string? Description { get; private set; }
        public string? PhotoUrl { get; private set; }
        public string? AdditionalLinks { get; private set; }

        public Guid CreatedBy { get; }
        public DateTime CreatedAt { get; }
        public Guid? UpdatedBy { get; private set; }
        public DateTime? UpdatedAt { get; private set; }

        private Schematic(
            SchematicId id,
            ComponentId componentId,
            string title,
            string? description,
            string? photoUrl,
            string? additionalLinks,
            Guid createdBy,
            DateTime createdAt,
            Guid? updatedBy = null,
            DateTime? updatedAt = null)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Назва не може бути порожнім");

            Id = id;
            ComponentId = componentId;
            Title = title;
            Description = description;
            PhotoUrl = photoUrl;
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
            string? additionalLinks = null,
            Guid? createdBy = null)
        {
            return new Schematic(
                SchematicId.New(),
                componentId,
                title,
                description,
                photoUrl,
                additionalLinks,
                createdBy ?? throw new ArgumentException("Дані про користувача не можуть бути порожніми"),
                DateTime.UtcNow);
        }

        public void Update(
            string title,
            string? description,
            string? photoUrl,
            string? additionalLinks,
            Guid updatedBy)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Назва не може бути порожньою");

            Title = title;
            Description = description;
            PhotoUrl = photoUrl;
            AdditionalLinks = additionalLinks;
            UpdatedBy = updatedBy;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
