using Domain.History.Actions;
using Domain.History.EntityTypes;
using Domain.Users;

namespace Domain.History
{
    public class History
    {
        public HistoryId Id { get; }
        public UserId UserId { get; }
        public ActionId ActionId { get; }
        public EntityTypeId EntityTypeId { get; }
        public string EntityId { get; }
        public string? OldValues { get; }
        public string? NewValues { get; } 
        public DateTime Time { get; }

        private History(
            HistoryId id,
            UserId userId,
            ActionId actionId,
            EntityTypeId entityTypeId,
            string entityId,
            string? oldValues,
            string? newValues,
            DateTime time)
        {
            Id = id;
            UserId = userId;
            ActionId = actionId;
            EntityTypeId = entityTypeId;
            EntityId = entityId;
            OldValues = oldValues;
            NewValues = newValues;
            Time = time;
        }

        public static History Create(
            UserId userId,
            ActionId actionId,
            EntityTypeId entityTypeId,
            string entityId,
            string? oldValues = null,
            string? newValues = null)
        {
            return new History(
                HistoryId.New(),
                userId,
                actionId,
                entityTypeId,
                entityId,
                oldValues,
                newValues,
                DateTime.UtcNow);
        }
    }
}
