using Application.Common.Interfaces.Queries;
using Domain.Schematics;
using Domain.Schematics.Schematics;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Schematics.Queries
{
    public sealed record GetSchematicByIdQuery(Guid Id)
            : IRequest<Option<Schematic>>;
    public sealed class GetSchematicByIdQueryHandler(
        ISchematicQueries queries)
        : IRequestHandler<GetSchematicByIdQuery, Option<Schematic>>
    {
        public async Task<Option<Schematic>> Handle(
            GetSchematicByIdQuery request,
            CancellationToken cancellationToken)
        {
            var id = new SchematicId(request.Id);
            return await queries.GetByIdAsync(id, cancellationToken);
        }
    }
}
