using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Categories;
using Domain.Components;
using LanguageExt;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class ComponentRepository : IComponentRepository, IComponentQueries
    {
        private readonly ApplicationDbContext _context;

        public ComponentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Component> AddAsync(Component component, CancellationToken cancellationToken)
        {
            _context.AttachRange(component.Tags);

            await _context.Components.AddAsync(component, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return component;
        }

        public async Task<Component> UpdateAsync(Component component, CancellationToken cancellationToken)
        {
            _context.Components.Update(component);
            await _context.SaveChangesAsync(cancellationToken);
            return component;
        }

        public async Task<Component> DeleteAsync(Component component, CancellationToken cancellationToken)
        {
            _context.Components.Remove(component);
            await _context.SaveChangesAsync(cancellationToken);
            return component;
        }

        public async Task<Option<Component>> GetByIdAsync(ComponentId id, CancellationToken cancellationToken)
        {
            var component = await _context.Components
                .Include(c => c.Tags)
                .Include(c => c.Comments)
                .Include(c => c.UsefulLinks)
                .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

            return component ?? Option<Component>.None;
        }

        public async Task<Option<Component>> GetByNameAsync(string name, CancellationToken cancellationToken)
        {
            var component = await _context.Components
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Name == name, cancellationToken);

            return component ?? Option<Component>.None;
        }

        public async Task<IReadOnlyList<Component>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.Components
                .Include(c => c.Tags)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }
        public async Task<IReadOnlyList<Component>> GetByCategoryIdAsync(CategoryId categoryId, CancellationToken cancellationToken)
        {
            return await _context.Components
                .Where(c => c.CategoryId == categoryId)
                .Include(c => c.Tags)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }
    }
}
