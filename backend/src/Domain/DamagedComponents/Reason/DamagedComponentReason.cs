using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DamagedComponents.Reason
{
    public class DamagedComponentReason
    {
        protected DamagedComponentReason() { }
        public DamagedComponentReasonId Id { get; }
        public string Name { get; private set; }
        public string? Description { get; private set; }

        public DateTime CreatedAt { get; }

        private DamagedComponentReason(
            DamagedComponentReasonId id,
            string name,
            string? description,
            DateTime createdAt)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Назва не може бути порожньою");

            Id = id;
            Name = name;
            Description = description;
            CreatedAt = createdAt;
        }

        public static DamagedComponentReason Create(string name, string? description = null)
            => new(DamagedComponentReasonId.New(), name, description, DateTime.UtcNow);

        public void Update(string name, string? description)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Назва не може бути порожньою");

            Name = name;
            Description = description;
        }
    }
}
