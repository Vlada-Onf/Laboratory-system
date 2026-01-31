using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Categories
{
    public record CategoryId(Guid Value)
    {
        public static CategoryId Empty => new(Guid.Empty);
        public static CategoryId New() => new(Guid.NewGuid());
        public override string ToString() => Value.ToString();
    }
}
