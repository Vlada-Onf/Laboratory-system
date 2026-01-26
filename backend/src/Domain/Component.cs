using System.Data;
using System.Runtime.CompilerServices;

namespace Domain
{
    public class Component
    {
        public Guid Id { get; }
        public Guid CategoryId { get; private set; }
        public string Name { get; private set; }
        public string? Description { get; private set; } 
        public int Quantity { get; private set; }
        public Guid UnitId { get; private set; }
        public decimal Price { get; private set; }
        public decimal TotalCost { get; private set; }
        public string PhotoUrl { get; private set; } 
        public string SupplierLink { get; private set; } 
        public string? DocumentationLink { get; private set; }
        public DateTime CreatedAt { get; }
        public Guid CreatedBy { get; }
        public DateTime LastUpdatedAt { get; }
        public Guid LastUpdatedBy { get; }
        public List<string>? UsefulLink { get; private set; }
        public List<string>? Comments { get; private set; }
        public ICollection<Tag>? Tags { get;}

        private Component(
            Guid id,
            Guid categoryId,
            string name,
            string description,
            int quantity,
            Guid unitId,
            decimal price,
            decimal totalCost,
            string photoUrl,
            string supplierLink,
            string documentationLink,
            DateTime createdAt,
            DateTime lastUpdatedAt,
            Guid createdBy,
            List<string> usefulLink,
            List<string> comments,
            Guid lastUpdatedBy)
        {
            Id = id;
            CategoryId = categoryId;
            Name = name; 
            Description = description;
            Quantity = quantity;
            UnitId = unitId;
            Price = price;
            TotalCost = totalCost;
            PhotoUrl = photoUrl;
            SupplierLink = supplierLink;
            DocumentationLink = documentationLink;
            CreatedAt = createdAt;
            LastUpdatedAt = lastUpdatedAt;
            CreatedBy = createdBy; 
            UsefulLink = usefulLink;
            Comments = comments;
            LastUpdatedAt = lastUpdatedAt;
        }
    }
}
