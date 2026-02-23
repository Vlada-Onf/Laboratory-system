using Application.Tags.Exceptions;
using Domain.Tags;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Tags.Commands.Delete
{
    public record DeleteTagCommand(Guid Id, Guid PerformedBy)
            : IRequest<Either<TagException, Tag>>;
}
