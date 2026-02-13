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

namespace Application.Roles.Commands.Update
{
    public sealed class UpdateRoleCommandHandler(
            IRoleRepository roleRepository)
            : IRequestHandler<UpdateRoleCommand, Either<RoleException, Role>>
    {
        public async Task<Either<RoleException, Role>> Handle(
            UpdateRoleCommand request,
            CancellationToken cancellationToken)
        {
            var roleId = new RoleId(request.Id);
            var option = await roleRepository.GetByIdAsync(roleId, cancellationToken);

            return await option.MatchAsync(
                Some: role => UpdateEntity(role, request, cancellationToken),
                None: () => Task.FromResult<Either<RoleException, Role>>(
                    new RoleNotFoundException(roleId)));
        }

        private async Task<Either<RoleException, Role>> UpdateEntity(
            Role role,
            UpdateRoleCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                role.Update(request.Name);

                var updated = await roleRepository.UpdateAsync(role, cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledRoleException(role.Id, ex);
            }
        }
    }
}
