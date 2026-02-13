using Application.UsefulLink.Exceptions;
using Domain.Components.UsefulLink;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UsefulLink.Commands.Update
{
    public sealed record UpdateComponentUsefulLinkCommand
        : IRequest<Either<ComponentUsefulLinkException, ComponentUsefulLink>>
    {
        public required Guid Id { get; init; }
        public required string Title { get; init; }
        public required string Url { get; init; }
        public required Guid UpdatedBy { get; init; }
    }
}
