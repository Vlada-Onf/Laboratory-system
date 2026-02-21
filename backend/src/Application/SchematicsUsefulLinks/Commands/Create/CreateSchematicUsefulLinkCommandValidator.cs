using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.SchematicsUsefulLinks.Commands.Create
{
    public sealed class CreateSchematicUsefulLinkCommandValidator
        : FluentValidation.AbstractValidator<CreateSchematicUsefulLinkCommand>
    {
        public CreateSchematicUsefulLinkCommandValidator()
        {
            RuleFor(x => x.SchematicId).NotEmpty();
            RuleFor(x => x.Title)
                .NotEmpty().MaximumLength(200);
            RuleFor(x => x.Url)
                .NotEmpty().MaximumLength(1000);
            RuleFor(x => x.CreatedBy).NotEmpty();
        }
    }
}
