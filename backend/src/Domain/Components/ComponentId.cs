using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Components
{
    public record ComponentId(Guid Value)
    {
        public static ComponentId New() => new(Guid.NewGuid());
        public static ComponentId Empty => new(Guid.Empty);
        public override string ToString() => Value.ToString();
    }
}
