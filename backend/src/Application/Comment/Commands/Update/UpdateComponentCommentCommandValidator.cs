using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Comment.Commands.Update
{
    public sealed class UpdateComponentCommentCommandValidator
            : AbstractValidator<UpdateComponentCommentCommand>
    {
        public UpdateComponentCommentCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");

            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Коментар не може бути порожнім")
                .MaximumLength(2000);
        }
    }
}
