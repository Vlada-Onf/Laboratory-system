using Application.Common.Interfaces.Repositories;
using Domain.Tags;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class TagRepository : ITagRepository
    {
        private readonly ApplicationDbContext _context;

        public TagRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<Tag>> GetByIdsAsync(List<Guid> tagIds, CancellationToken cancellationToken)
        {
            return await _context.Tags
                .AsNoTracking()
                .Where(t => tagIds.Contains(t.Id.Value))
                .ToListAsync(cancellationToken);
        }
    }
}
