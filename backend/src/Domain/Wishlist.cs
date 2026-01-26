using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Wishlist
    {
        public Guid Id { get; }
        public string Name { get; private set; }
        public string Description { get; private set; }
        public Guid Importance { get; private set; }
        public int QuantityNeeded { get; private set; }
        public Guid RequestedId { get; private set; }
        public DateTime RequestedAt { get; }
        public Guid Status { get; private set; }
        public DateTime? CompletedAt { get; }
        public string Reason { get; private set; }
        private Wishlist(
            Guid id,
            string name,
            string description,
            Guid importance,
            int quantityNeeded,
            Guid requestedId,
            DateTime requestedAt,
            Guid status,
            DateTime? completedAt,
            string reason)
        {
            Id = id;
            Name = name;
            Description = description;
            Importance = importance;
            QuantityNeeded = quantityNeeded;
            RequestedId = requestedId;
            RequestedAt = requestedAt;
            Status = status;
            CompletedAt = completedAt;
            Reason = reason;
        }
    }
}