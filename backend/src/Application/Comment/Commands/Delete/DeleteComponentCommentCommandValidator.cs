using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Comment.Commands.Delete
{
    public sealed class DeleteComponentCommentCommandValidator
            : AbstractValidator<DeleteComponentCommentCommand>
    {
        public DeleteComponentCommentCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");
        }
    }
}
