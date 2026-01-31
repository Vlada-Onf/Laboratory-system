using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Wishlists.Status
{
    public class WishlistStatus
    {
        public WishlistStatusId Id { get; }
        public string Name { get; private set; }
        public string? Description { get; private set; }

        public DateTime CreatedAt { get; }

        private WishlistStatus(
            WishlistStatusId id,
            string name,
            string? description,
            DateTime createdAt)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name не може бути порожнім");

            Id = id;
            Name = name;
            Description = description;
            CreatedAt = createdAt;
        }

        public static WishlistStatus Create(string name, string? description = null)
            => new(WishlistStatusId.New(), name, description, DateTime.UtcNow);

        public void Update(string name, string? description)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name не може бути порожнім");

            Name = name;
            Description = description;
        }
    }
}
