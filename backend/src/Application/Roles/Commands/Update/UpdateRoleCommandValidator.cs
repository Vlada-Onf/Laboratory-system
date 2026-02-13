using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Roles.Commands.Update
{
    public sealed class UpdateRoleCommandValidator
            : AbstractValidator<UpdateRoleCommand>
    {
        public UpdateRoleCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Назва ролі є обов'язковою")
                .MaximumLength(100).WithMessage("Назва не може бути довшою за 100 символів");
        }
    }
}
