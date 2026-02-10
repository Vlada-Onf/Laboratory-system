using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Components.UsefulLink
{
    public record ComponentUsefulLinkId(Guid Value)
    {
        public static ComponentUsefulLinkId New() => new(Guid.NewGuid());
        public static ComponentUsefulLinkId Empty => new(Guid.Empty);
        public override string ToString() => Value.ToString();
    }
}
