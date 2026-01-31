using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Categories
{
    public class Category
    {
        public CategoryId Id { get; }
        public string Name { get; private set; }
        public string? Description { get; private set; }
        public string? PhotoUrl { get; private set; }
        public string? CardColor { get; private set; }
        public DateTime CreatedAt { get; }
        public Guid CreatedBy { get; }
        public DateTime? LastUpdatedAt { get; private set; }
        public Guid? LastUpdatedBy { get; private set; }

        private Category(
            CategoryId id,
            string name,
            string? description,
            string? photoUrl,
            string? cardColor,
            DateTime createdAt,
            Guid createdBy,
            DateTime? lastUpdatedAt = null,
            Guid? lastUpdatedBy = null)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Назва не може бути порожньою");

            Id = id;
            Name = name;
            Description = description;
            PhotoUrl = photoUrl;
            CardColor = cardColor;
            CreatedAt = createdAt;
            CreatedBy = createdBy;
            LastUpdatedAt = lastUpdatedAt;
            LastUpdatedBy = lastUpdatedBy;
        }

        public static Category Create(
         string name,
         Guid createdBy,
         string? description = null,
         string? photoUrl = null,
         string? cardColor = null)
        {
            return new Category(
                CategoryId.New(),
                name,
                description,
                photoUrl,
                cardColor,
                DateTime.UtcNow,
                createdBy);
        }

        public void Update(
            string name,
            string? description,
            string? photoUrl,
            string? cardColor,
            Guid lastUpdatedBy)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Назва не може бути порожньою");

            Name = name;
            Description = description;
            PhotoUrl = photoUrl;
            CardColor = cardColor;
            LastUpdatedAt = DateTime.UtcNow;
            LastUpdatedBy = lastUpdatedBy;
        }
    }
}
