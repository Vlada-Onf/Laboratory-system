using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Action
    {
        public Guid Id { get; }
        public string Name { get; }
        public string Description { get; }
        private Action(
            Guid id,
            string name,
            string description)
        {
            Id = id;
            Name = name;
            Description = description;
        }
    }
}
