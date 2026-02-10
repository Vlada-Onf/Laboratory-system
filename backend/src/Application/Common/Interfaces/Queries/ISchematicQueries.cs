using Domain.Components;
using Domain.Schematics;
using Domain.Schematics.Schematics;
using LanguageExt;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Queries
{
    public interface ISchematicQueries
    {
        Task<Option<Schematic>> GetByIdAsync(SchematicId id, CancellationToken cancellationToken);
        Task<IReadOnlyList<Schematic>> GetByComponentIdAsync(ComponentId componentId, CancellationToken cancellationToken);
    }
}
