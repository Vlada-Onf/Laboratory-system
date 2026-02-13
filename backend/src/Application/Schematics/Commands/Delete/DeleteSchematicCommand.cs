using Application.Schematics.Exceptions;
using Domain.Schematics;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Schematics.Commands.Delete
{
    public sealed record DeleteSchematicCommand(Guid Id)
            : IRequest<Either<SchematicException, Schematic>>;
}
