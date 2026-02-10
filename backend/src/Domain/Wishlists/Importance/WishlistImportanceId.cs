using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Wishlists.Importance
{
    public record WishlistImportanceId(Guid Value)
    {
        public static WishlistImportanceId New() => new(Guid.NewGuid());
        public static WishlistImportanceId Empty => new(Guid.Empty);
        public override string ToString() => Value.ToString();
    }
}
