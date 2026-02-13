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

namespace Application.Roles.Commands.Delete
{
    public sealed class DeleteRoleCommandHandler(
            IRoleRepository roleRepository)
            : IRequestHandler<DeleteRoleCommand, Either<RoleException, Role>>
    {
        public async Task<Either<RoleException, Role>> Handle(
            DeleteRoleCommand request,
            CancellationToken cancellationToken)
        {
            var roleId = new RoleId(request.Id);
            var option = await roleRepository.GetByIdAsync(roleId, cancellationToken);

            return await option.MatchAsync(
                Some: role => DeleteEntity(role, cancellationToken),
                None: () => Task.FromResult<Either<RoleException, Role>>(
                    new RoleNotFoundException(roleId)));
        }

        private async Task<Either<RoleException, Role>> DeleteEntity(
            Role role,
            CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await roleRepository.DeleteAsync(role, cancellationToken);
                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledRoleException(role.Id, ex);
            }
        }
    }
}
