using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DamagedComponents.Commands.Delete
{
    public class DeleteDamagedComponentCommandValidator
        : AbstractValidator<DeleteDamagedComponentCommand>
    {
        public DeleteDamagedComponentCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
        }
    }
}
