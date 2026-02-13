using Application.UsefulLink.Exceptions;
using Domain.Components.UsefulLink;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UsefulLink.Commands.Create
{
    public sealed record CreateComponentUsefulLinkCommand
            : IRequest<Either<ComponentUsefulLinkException, ComponentUsefulLink>>
    {
        public required Guid ComponentId { get; init; }
        public required string Title { get; init; }
        public required string Url { get; init; }
        public required Guid CreatedBy { get; init; }
    }
}
