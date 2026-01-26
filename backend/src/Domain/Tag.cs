using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Tag
    {
        public Guid Id { get; }
        public string Name { get; private set; }
        public string Color { get; private set; }
        public DateTime CreatedAt { get;}
        public Guid CreatedBy { get; } 

        private Tag(
            Guid id,
            string name,
            string color,
            DateTime createdAt,
            Guid createdBy )
        {
            Id = id;
            Name = name;
            Color = color;
            CreatedAt = createdAt;
            CreatedBy = createdBy;
        }
    }
}
