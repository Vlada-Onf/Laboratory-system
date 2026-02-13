using Application.Common.Interfaces.Repositories;
using Application.Roles.Exceptions;
using Domain.Roles;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Roles.Commands.Create
{
    public sealed class CreateRoleCommandHandler(
            IRoleRepository roleRepository)
            : IRequestHandler<CreateRoleCommand, Either<RoleException, Role>>
    {
        public async Task<Either<RoleException, Role>> Handle(
            CreateRoleCommand request,
            CancellationToken cancellationToken)
        {
            var existing = await roleRepository.GetByNameAsync(
                request.Name,
                cancellationToken);

            return await existing.MatchAsync(
                Some: r => Task.FromResult<Either<RoleException, Role>>(
                    new RoleAlreadyExistException(r.Id)),
                None: () => CreateEntity(request, cancellationToken));
        }

        private async Task<Either<RoleException, Role>> CreateEntity(
            CreateRoleCommand request,
            CancellationToken cancellationToken)
        {
            RoleId? roleId = null;

            try
            {
                var role = Role.Create(request.Name);

                roleId = role.Id;

                var created = await roleRepository.AddAsync(role, cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledRoleException(
                    roleId ?? RoleId.Empty(),
                    ex);
            }
        }
    }
}
