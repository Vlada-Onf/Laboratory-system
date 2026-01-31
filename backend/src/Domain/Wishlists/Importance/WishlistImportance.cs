using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Wishlists.Importance
{
    public class WishlistImportance
    {
        public WishlistImportanceId Id { get; }
        public string Name { get; private set; }
        public int Level { get; private set; }

        public DateTime CreatedAt { get; }

        private WishlistImportance(
            WishlistImportanceId id,
            string name,
            int level,
            DateTime createdAt)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name не може бути порожнім");

            if (level < 1 || level > 3)
                throw new ArgumentException("Level мусить бути від 1 до 3");

            Id = id;
            Name = name;
            Level = level;
            CreatedAt = createdAt;
        }

        public static WishlistImportance Create(string name, int level)
            => new(WishlistImportanceId.New(), name, level, DateTime.UtcNow);

        public void Update(string name, int level)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name не може бути порожнім");

            if (level < 1 || level > 3)
                throw new ArgumentException("Level мусить бути від 1 до 3");

            Name = name;
            Level = level;
        }
    }
}
