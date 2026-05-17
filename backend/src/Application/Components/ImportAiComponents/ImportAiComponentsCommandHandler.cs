using Application.Common.Interfaces.Repositories;
using Application.Components.Exceptions;
using Application.HistoryEntries;
using Domain.Categories;
using Domain.Components;
using Domain.Users;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Components.Commands.ImportAiComponents
{
    public class ImportAiComponentsCommandHandler(
        IComponentRepository componentRepository,
        ICategoryRepository categoryRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<ImportAiComponentsCommand, Either<ComponentException, List<Component>>>
    {
        public async Task<Either<ComponentException, List<Component>>> Handle(
            ImportAiComponentsCommand request,
            CancellationToken cancellationToken)
        {
            var categoryId = new CategoryId(request.CategoryId);

            var categoryExists = await categoryRepository.ExistsAsync(categoryId, cancellationToken);
            if (!categoryExists)
                return new ComponentCategoryNotFoundException(ComponentId.Empty());

            var createdBy = new UserId(request.CreatedBy);
            var components = new List<Component>();

            foreach (var item in request.Items.Where(i => !string.IsNullOrWhiteSpace(i.Name)))
            {
                var existing = await componentRepository.GetByNameAsync(item.Name, cancellationToken);
                if (existing.IsSome)
                    continue;

                var component = Component.Create(
                    categoryId: categoryId,
                    name: item.Name.Trim(),
                    description: BuildDescription(item),
                    quantity: 1,
                    price: 0,
                    photoUrl: string.Empty,
                    supplierLink: string.Empty,
                    documentationLink: null,
                    createdBy: createdBy);

                var created = await componentRepository.AddAsync(component, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    created.Id,
                    created.CategoryId,
                    created.Name,
                    created.Description,
                    created.Quantity,
                    created.Price,
                    created.CreatedAt,
                    created.CreatedBy
                });

                await historyObserver.EntityCreatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "Component",
                    entityId: created.Id.Value.ToString(),
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                components.Add(created);
            }

            return components;
        }

        private static string BuildDescription(ImportAiItemData item)
        {
            var parts = new List<string>();
            if (!string.IsNullOrWhiteSpace(item.InventoryNumber))
                parts.Add("Інвентарний номер: " + item.InventoryNumber);
            if (!string.IsNullOrWhiteSpace(item.SerialNumber))
                parts.Add("Серійний номер: " + item.SerialNumber);
            if (!string.IsNullOrWhiteSpace(item.State))
                parts.Add("Стан: " + item.State);
            if (!string.IsNullOrWhiteSpace(item.Location))
                parts.Add("Локація: " + item.Location);
            if (!string.IsNullOrWhiteSpace(item.Notes))
                parts.Add("Примітки: " + item.Notes);
            return string.Join(Environment.NewLine, parts);
        }
    }
}