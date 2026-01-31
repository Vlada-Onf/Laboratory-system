using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Needs.Importance
{
    public class NeedImportance
    {
        public NeedImportanceId Id { get; }
        public string Name { get; private set; }
        public int Level { get; private set; }

        public DateTime CreatedAt { get; }

        private NeedImportance(
            NeedImportanceId id,
            string name,
            int level,
            DateTime createdAt)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Назва не може бути порожнім");

            if (level < 1 || level > 4)
                throw new ArgumentException("Рівень мусить бути від 1 до 4");

            Id = id;
            Name = name;
            Level = level;
            CreatedAt = createdAt;
        }

        public static NeedImportance Create(string name, int level)
            => new(NeedImportanceId.New(), name, level, DateTime.UtcNow);

        public void Update(string name, int level)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Назва не може бути порожнім");

            if (level < 1 || level > 4)
                throw new ArgumentException("Рівень мусить бути від 1 до 4");

            Name = name;
            Level = level;
        }
    }
}
