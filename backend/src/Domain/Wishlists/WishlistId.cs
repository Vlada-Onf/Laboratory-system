using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Wishlists
{
    public record WishlistId(Guid Value)
    {
        public static WishlistId Empty => new(Guid.Empty);
        public static WishlistId New() => new(Guid.NewGuid());
        public override string ToString() => Value.ToString();
    }
}
