using Application.Common.Interfaces.Repositories;
using Application.EntityTypes.Exceptions;
using Domain.History.EntityTypes;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.EntityTypes.Commands.Update
{
    public sealed class UpdateEntityTypeCommandHandler(
            IEntityTypeRepository entityTypeRepository)
            : IRequestHandler<UpdateEntityTypeCommand, Either<EntityTypeException, EntityType>>
    {
        public async Task<Either<EntityTypeException, EntityType>> Handle(
            UpdateEntityTypeCommand request,
            CancellationToken cancellationToken)
        {
            var typeId = new EntityTypeId(request.Id);
            var option = await entityTypeRepository.GetByIdAsync(typeId, cancellationToken);

            return await option.MatchAsync(
                Some: et => UpdateEntity(et, request, cancellationToken),
                None: () => Task.FromResult<Either<EntityTypeException, EntityType>>(
                    new EntityTypeNotFoundException(typeId)));
        }

        private async Task<Either<EntityTypeException, EntityType>> UpdateEntity(
            EntityType entityType,
            UpdateEntityTypeCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                entityType.Update(request.Name, request.Description);

                var updated = await entityTypeRepository.UpdateAsync(entityType, cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledEntityTypeException(entityType.Id, ex);
            }
        }
    }
}
