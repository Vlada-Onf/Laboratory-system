using Domain.Components;
using Domain.Users;
using Domain.Wishlists.Importance;
using Domain.Wishlists.Status;

namespace Domain.Wishlists
{
    public class Wishlist
    {
        public WishlistId Id { get; }
        public ComponentId ComponentId { get; private set; }

        public string Name { get; private set; }
        public string? Description { get; private set; }
        public int QuantityNeeded { get; private set; }

        public UserId RequestedBy { get; }
        public DateTime RequestedAt { get; }

        public WishlistImportanceId ImportanceId { get; private set; }
        public WishlistStatusId StatusId { get; private set; }

        public DateTime? CompletedAt { get; private set; }
        public string? CompletionReason { get; private set; }

        private Wishlist(
            WishlistId id,
            ComponentId componentId,
            string name,
            string? description,
            int quantityNeeded,
            UserId requestedBy,
            DateTime requestedAt,
            WishlistImportanceId importanceId,
            WishlistStatusId statusId,
            DateTime? completedAt = null,
            string? completionReason = null)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name не може бути порожнім");

            if (quantityNeeded <= 0)
                throw new ArgumentException("QuantityNeeded мусить бути більше 0");

            Id = id;
            ComponentId = componentId;
            Name = name;
            Description = description;
            QuantityNeeded = quantityNeeded;
            RequestedBy = requestedBy;
            RequestedAt = requestedAt;
            ImportanceId = importanceId;
            StatusId = statusId;
            CompletedAt = completedAt;
            CompletionReason = completionReason;
        }

        public static Wishlist Create(
            ComponentId componentId,
            string name,
            string? description,
            int quantityNeeded,
            UserId requestedBy,
            WishlistImportanceId importanceId,
            WishlistStatusId statusId)
        {
            return new Wishlist(
                WishlistId.New(),
                componentId,
                name,
                description,
                quantityNeeded,
                requestedBy,
                DateTime.UtcNow,
                importanceId,
                statusId);
        }

        public void UpdateStatus(WishlistStatusId statusId, string? reason = null)
        {
            StatusId = statusId;
            CompletedAt = DateTime.UtcNow;
            CompletionReason = reason;
        }

        public void UpdateImportance(WishlistImportanceId importanceId)
        {
            ImportanceId = importanceId;
        }

        public void UpdateDetails(
            string name,
            string? description,
            int quantityNeeded,
            WishlistImportanceId importanceId)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name не може бути порожнім");

            if (quantityNeeded <= 0)
                throw new ArgumentException("QuantityNeeded мусить бути більше 0");

            Name = name;
            Description = description;
            QuantityNeeded = quantityNeeded;
            ImportanceId = importanceId;
        }
    }
}