using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.SchematicsUsefulLinks.Commands.Update
{
    public sealed class UpdateSchematicUsefulLinkCommandValidator
            : FluentValidation.AbstractValidator<UpdateSchematicUsefulLinkCommand>
    {
        public UpdateSchematicUsefulLinkCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Title)
                .NotEmpty().MaximumLength(200);
            RuleFor(x => x.Url)
                .NotEmpty().MaximumLength(1000);
            RuleFor(x => x.UpdatedBy).NotEmpty();
        }
    }
}
