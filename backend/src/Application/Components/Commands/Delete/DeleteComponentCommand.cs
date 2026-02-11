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
    public record DeleteComponentCommand(Guid Id)
           : IRequest<Either<ComponentException, Component>>;
}
