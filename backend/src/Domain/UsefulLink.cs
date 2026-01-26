using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class UsefulLink
    {
        public Guid Id { get; }
        public Guid ComponentId { get; private set; }
        public string Title { get; private set; }
        public string Link { get; private set; }
        public Guid CreatedBy { get; }
        public DateTime CreatedAt { get; }
        public DateTime UpdatedAt { get; }
        public Guid UpdatedBy { get; }
        private UsefulLink(
            Guid id,
            Guid componentId, 
            string title,
            string link,
            Guid createdBy,
            DateTime createdAt,
            DateTime updatedAt,
            Guid updatedBy)
        {
            Id = id;
            ComponentId = componentId;
            Title = title;
            Link = link;
            CreatedBy = createdBy;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
            UpdatedBy = updatedBy;
        }
    }
}
