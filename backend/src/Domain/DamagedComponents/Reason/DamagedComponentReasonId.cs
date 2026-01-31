using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DamagedComponents.Reason
{
    public record DamagedComponentReasonId(Guid Value)
    {
        public static DamagedComponentReasonId Empty => new(Guid.Empty);
        public static DamagedComponentReasonId New() => new(Guid.NewGuid());
        public override string ToString() => Value.ToString();
    }
}
