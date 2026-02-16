using Domain.Components;
using Domain.Needs.Importance;
using Domain.Needs.Status;
using Domain.Users;

namespace Domain.Needs
{
    public sealed class Need
    {
        public NeedId Id { get; private set; }
        public ComponentId ComponentId { get; private set; }
        public NeedStatusId StatusId { get; private set; }
        public int QuantityNeeded { get; private set; }
        public UserId RequestedBy { get; private set; }
        public DateTime RequestedAt { get; private set; }
        public string? Description { get; private set; }
        public DateTime? CompletedAt { get; private set; }
        public string? CompletionReason { get; private set; }
        public NeedImportanceId ImportanceId { get; private set; }

        private Need() { }

        private Need(
            NeedId id,
            ComponentId componentId,
            NeedStatusId statusId,
            int quantityNeeded,
            UserId requestedBy,
            DateTime requestedAt,
            string? description,
            NeedImportanceId importanceId)
        {
            Id = id;
            ComponentId = componentId;
            StatusId = statusId;
            QuantityNeeded = quantityNeeded;
            RequestedBy = requestedBy;
            RequestedAt = requestedAt;
            Description = description;
            ImportanceId = importanceId;
        }

        public static Need Create(
            ComponentId componentId,
            int quantityNeeded,
            UserId requestedBy,
            string? description,
            NeedImportanceId importanceId,
            NeedStatusId statusId)
        {
            var id = NeedId.New();
            var requestedAt = DateTime.UtcNow;

            return new Need(
                id,
                componentId,
                statusId,
                quantityNeeded,
                requestedBy,
                requestedAt,
                description,
                importanceId);
        }

        public void UpdateDetails(
            int quantityNeeded,
            string? description,
            NeedImportanceId importanceId,
            NeedStatusId statusId)
        {
            QuantityNeeded = quantityNeeded;
            Description = description;
            ImportanceId = importanceId;
            StatusId = statusId;
        }

        public void UpdateImportance(NeedImportanceId importanceId)
        {
            ImportanceId = importanceId;
        }

        public void UpdateStatus(NeedStatusId statusId)
        {
            StatusId = statusId;
        }
    }
}
