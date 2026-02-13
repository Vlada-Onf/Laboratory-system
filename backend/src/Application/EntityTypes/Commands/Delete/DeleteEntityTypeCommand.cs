using Application.EntityTypes.Exceptions;
using Domain.History.EntityTypes;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.EntityTypes.Commands.Delete
{
    public sealed record DeleteEntityTypeCommand(Guid Id)
        : IRequest<Either<EntityTypeException, EntityType>>;
}
