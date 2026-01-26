using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Role
    {
        public Guid Id { get; }
        public string Name { get; private set; }

        private Role(Guid id, string name)
        {
            Id = id;
            Name = name; 
        }
    }
}
