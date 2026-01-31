using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Needs
{
    public record NeedId(Guid Value)
    {
        public static NeedId Empty => new(Guid.Empty);
        public static NeedId New() => new(Guid.NewGuid());
        public override string ToString() => Value.ToString();
    }
}
