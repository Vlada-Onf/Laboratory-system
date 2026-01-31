using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.History.EntityTypes
{
    public record EntityTypeId(Guid Value)
    {
        public static EntityTypeId Empty => new(Guid.Empty);
        public static EntityTypeId New() => new(Guid.NewGuid());
        public override string ToString() => Value.ToString();
    }
}
