using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Tags
{
    public record TagId(Guid Value)
    {
        public static TagId Empty => new(Guid.Empty);
        public static TagId New() => new(Guid.NewGuid());
        public override string ToString() => Value.ToString();
    }
}
