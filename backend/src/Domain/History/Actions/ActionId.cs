using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.History.Actions
{
    public record ActionId(Guid Value)
    {
        public static ActionId Empty => new(Guid.Empty);
        public static ActionId New() => new(Guid.NewGuid());
        public override string ToString() => Value.ToString();
    }
}
