using Application.NeedsImportance.Exceptions;
using Domain.Needs.Importance;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.NeedsImportance.Commands.Delete
{
    public sealed record DeleteNeedImportanceCommand(Guid Id)
           : IRequest<Either<NeedImportanceException, NeedImportance>>;
}
