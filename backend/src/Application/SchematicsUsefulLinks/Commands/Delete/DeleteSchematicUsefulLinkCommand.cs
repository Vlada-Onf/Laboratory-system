using Application.SchematicsUsefulLinks.Exceptions;
using Domain.Schematics.UsefulLink;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.SchematicsUsefulLinks.Commands.Delete
{
    public sealed record DeleteSchematicUsefulLinkCommand(Guid Id, Guid PerformedBy)
            : IRequest<Either<SchematicUsefulLinkException, SchematicUsefulLink>>;
}
