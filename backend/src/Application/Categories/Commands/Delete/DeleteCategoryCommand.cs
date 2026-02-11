using Application.Categories.Exceptions;
using Domain.Categories;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Categories.Commands.Delete
{
    public record DeleteCategoryCommand(Guid Id)
        : IRequest<Either<CategoryException, Category>>;

}
