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

namespace Application.EntityTypes.Commands.Create
{
    public sealed class CreateEntityTypeCommandHandler(
        IEntityTypeRepository entityTypeRepository)
        : IRequestHandler<CreateEntityTypeCommand, Either<EntityTypeException, EntityType>>
    {
        public async Task<Either<EntityTypeException, EntityType>> Handle(
            CreateEntityTypeCommand request,
            CancellationToken cancellationToken)
        {
            var existing = await entityTypeRepository.GetByNameAsync(
                request.Name,
                cancellationToken);

            return await existing.MatchAsync(
                Some: e => Task.FromResult<Either<EntityTypeException, EntityType>>(
                    new EntityTypeAlreadyExistException(e.Id)),
                None: () => CreateEntity(request, cancellationToken));
        }

        private async Task<Either<EntityTypeException, EntityType>> CreateEntity(
            CreateEntityTypeCommand request,
            CancellationToken cancellationToken)
        {
            EntityTypeId? typeId = null;

            try
            {
                var entityType = EntityType.Create(
                    name: request.Name,
                    description: request.Description);

                typeId = entityType.Id;

                var created = await entityTypeRepository.AddAsync(entityType, cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledEntityTypeException(
                    typeId ?? EntityTypeId.Empty(),
                    ex);
            }
        }
    }
}
