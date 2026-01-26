using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Nodes;
using System.Threading.Tasks;

namespace Domain
{
    public class History
    {
        public Guid Id { get; }
        public Guid UserId { get; }
        public Guid Action { get; }
        public Guid EntityTypeId { get; }
        public JsonArray oldValues { get; }
        public JsonArray newValues { get; }
        public DateTime Time { get; }

        private History(
            Guid id,
            Guid userId,
            Guid action,
            Guid entityTypeId,
            JsonArray oldValues,
            JsonArray newValues,
            DateTime time)
        {
            Id = id;
            UserId = userId;
            Action = action;
            EntityTypeId = entityTypeId;
            this.oldValues = oldValues;
            this.newValues = newValues;
            Time = time;
        }
    }
}
