using Application.UsefulLink.Exceptions;
using Domain.Components.UsefulLink;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UsefulLink.Commands.Delete
{
    public sealed record DeleteComponentUsefulLinkCommand(Guid Id, Guid PerformedBy)
            : IRequest<Either<ComponentUsefulLinkException, ComponentUsefulLink>>;
}
