using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class WishlistStatus
    {
        public Guid Id { get; }
        public string Name { get; private set; }
        private WishlistStatus (Guid id, string name)
        {
            Id = id;
            Name = name;
        }
    }
}
