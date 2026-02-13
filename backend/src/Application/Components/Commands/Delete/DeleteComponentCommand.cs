using Application.Common.Interfaces.Repositories;
using Application.Components.Exceptions;
using Domain.Components;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Components.Commands.Delete
{
    public sealed record DeleteComponentCommand(Guid Id, Guid DeletedBy)
        : IRequest<Either<ComponentException, Component>>;
}
