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

namespace Application.EntityTypes.Commands.Delete
{
    public sealed class DeleteEntityTypeCommandHandler(
         IEntityTypeRepository entityTypeRepository)
         : IRequestHandler<DeleteEntityTypeCommand, Either<EntityTypeException, EntityType>>
    {
        public async Task<Either<EntityTypeException, EntityType>> Handle(
            DeleteEntityTypeCommand request,
            CancellationToken cancellationToken)
        {
            var typeId = new EntityTypeId(request.Id);
            var option = await entityTypeRepository.GetByIdAsync(typeId, cancellationToken);

            return await option.MatchAsync(
                Some: et => DeleteEntity(et, cancellationToken),
                None: () => Task.FromResult<Either<EntityTypeException, EntityType>>(
                    new EntityTypeNotFoundException(typeId)));
        }

        private async Task<Either<EntityTypeException, EntityType>> DeleteEntity(
            EntityType entityType,
            CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await entityTypeRepository.DeleteAsync(entityType, cancellationToken);
                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledEntityTypeException(entityType.Id, ex);
            }
        }
    }
}