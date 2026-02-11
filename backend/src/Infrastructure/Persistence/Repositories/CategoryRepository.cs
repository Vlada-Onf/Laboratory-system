using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Categories;
using LanguageExt;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class CategoryRepository : ICategoryRepository, ICategoryQueries
    {
        private readonly ApplicationDbContext _context;

        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ExistsAsync(CategoryId id, CancellationToken cancellationToken)
        {
            return await _context.Categories
                .AnyAsync(c => c.Id == id, cancellationToken);
        }

        public async Task<IReadOnlyList<Category>> GetByIdsAsync(
            IReadOnlyList<CategoryId> categoryIds,
            CancellationToken cancellationToken)
        {
            return await _context.Categories
                .AsNoTracking()
                .Where(c => categoryIds.Contains(c.Id))
                .ToListAsync(cancellationToken);
        }

        public async Task<Option<Category>> GetByIdAsync(CategoryId id, CancellationToken cancellationToken)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

            return category ?? Option<Category>.None;
        }

        public async Task<IReadOnlyList<Category>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.Categories
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<Category> AddAsync(Category category, CancellationToken cancellationToken = default)
        {
            await _context.Categories.AddAsync(category, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return category;
        }

        public async Task<Category> UpdateAsync(Category category, CancellationToken cancellationToken = default)
        {
            _context.Categories.Update(category);
            await _context.SaveChangesAsync(cancellationToken);
            return category;
        }

        public async Task<Category> DeleteAsync(Category category, CancellationToken cancellationToken = default)
        {
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync(cancellationToken);
            return category;
        }

        public async Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken = default)
        {
            return await _context.Categories
                .AnyAsync(c => c.Name == name, cancellationToken);
        }

        public async Task<Option<Category>> GetByNameAsync(string name, CancellationToken cancellationToken)
        {
            var category = await _context.Categories
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Name == name, cancellationToken);

            return category ?? Option<Category>.None;
        }
    }
}
