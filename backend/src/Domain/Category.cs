using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Category
    {
        public Guid Id { get; }
        public string Name { get; private set; }
        public string Description { get; private set; }
        public string PhotoUrl { get; private set; }
        public string CardColor { get; private set; }
        public DateTime CreatedAt { get; }
        public Guid CreatedBy { get; }

        private Category (Guid id, string name, string description, string photoUrl, string cardColor, DateTime createdAt, Guid createdBy)
        {
            Id = id;
            Name = name;
            Description = description;
            PhotoUrl = photoUrl;
            CardColor = cardColor;
            CreatedAt = createdAt;
            CreatedBy = createdBy;
        }
    }
}
