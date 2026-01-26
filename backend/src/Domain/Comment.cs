using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{ 
    public class Comment
    {
        public Guid Id { get; }
        public Guid ComponentId { get; private set; }
        public string Content { get; private set; }
        public Guid CreatedBy { get; }
        public DateTime CreatedAt { get; }
        public DateTime UpdatedAt { get; }
        public Guid UpdatedBy { get; }
        private Comment(
            Guid id,
            Guid componentId,
            string content,
            Guid createdBy,
            DateTime createdAt,
            DateTime updatedAt,
            Guid updatedBy)
        {
            Id = id;
            ComponentId = componentId;
            Content = content;
            CreatedBy = createdBy;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
            UpdatedBy = updatedBy;
        }
    }
}
