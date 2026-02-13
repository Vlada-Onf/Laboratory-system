using Application.NeedsImportance.Exceptions;
using Domain.Needs.Importance;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.NeedsImportance.Commands.Update
{
    public sealed record UpdateNeedImportanceCommand
        : IRequest<Either<NeedImportanceException, NeedImportance>>
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public required int Level { get; init; }
    }
}
