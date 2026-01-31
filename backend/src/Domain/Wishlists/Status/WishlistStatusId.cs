using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Wishlists.Status
{
    public record WishlistStatusId(Guid Value)
    {
        public static WishlistStatusId Empty => new(Guid.Empty);
        public static WishlistStatusId New() => new(Guid.NewGuid());
        public override string ToString() => Value.ToString();
    }
}
