using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Need
    {
        public Guid Id { get; }
        public Guid ComponentId { get; private set; }
        public int quantityNeeded { get; private set; }
        public Guid RequestedId { get; private set; }
        public DateTime RequestedAt { get; }
        public string Description { get; private set; }
        public Guid Status { get; private set; }
        public DateTime? CompletedAt { get; }
        public string Reason { get; private set; }
        public Guid Importance { get; private set; }

        private Need(
            Guid id,
            Guid componentId,
            int quantityNeeded,
            Guid requestedId,
            DateTime requestedAt,
            string description,
            Guid status,
            DateTime? completedAt,
            string reason,
            Guid importance)
        {
            Id = id;
            ComponentId = componentId;
            this.quantityNeeded = quantityNeeded;
            RequestedId = requestedId;
            RequestedAt = requestedAt;
            Description = description;
            Status = status;
            CompletedAt = completedAt;
            Reason = reason;
            Importance = importance;
        } 
    }
}
