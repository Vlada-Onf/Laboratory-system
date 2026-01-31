using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Components.Comment
{
    public record ComponentCommentId(Guid Value)
    {
        public static ComponentCommentId Empty => new(Guid.Empty);
        public static ComponentCommentId New() => new(Guid.NewGuid());
        public override string ToString() => Value.ToString();
    }
}
