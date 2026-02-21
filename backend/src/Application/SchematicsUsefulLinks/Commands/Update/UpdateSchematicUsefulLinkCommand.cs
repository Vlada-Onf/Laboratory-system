using Application.SchematicsUsefulLinks.Exceptions;
using Domain.Schematics.UsefulLink;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.SchematicsUsefulLinks.Commands.Update
{
    public sealed record UpdateSchematicUsefulLinkCommand
            : IRequest<Either<SchematicUsefulLinkException, SchematicUsefulLink>>
    {
        public required Guid Id { get; init; }
        public required string Title { get; init; }
        public required string Url { get; init; }
        public required Guid UpdatedBy { get; init; }
    }
}
