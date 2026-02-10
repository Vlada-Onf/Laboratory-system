using Domain.Schematics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Repositories
{
    public interface ISchematicRepository
    {
        Task<Schematic> AddAsync(Schematic schematic, CancellationToken cancellationToken);
        Task<Schematic> UpdateAsync(Schematic schematic, CancellationToken cancellationToken);
        Task<Schematic> DeleteAsync(Schematic schematic, CancellationToken cancellationToken);
    }
}
