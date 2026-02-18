using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Roles
{
    public static class RoleIds
    {
        public static readonly RoleId SuperAdmin = new(new Guid("ab46f228-ee9f-4849-aacd-98780292fee8"));
        public static readonly RoleId Lab = new(new Guid("bbc9c32e-8c47-43f4-bc68-c29f81754dac"));
        public static readonly RoleId Admin = new(new Guid("f909c5e7-fe8f-42c8-aedc-bff8862f8e03"));
    }
}
