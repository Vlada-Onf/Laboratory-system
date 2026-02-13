using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Roles.Commands.Create
{
    public sealed class CreateRoleCommandValidator
            : AbstractValidator<CreateRoleCommand>
    {
        public CreateRoleCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Назва ролі є обов'язковою")
                .MaximumLength(100).WithMessage("Назва не може бути довшою за 100 символів");
        }
    }
}
