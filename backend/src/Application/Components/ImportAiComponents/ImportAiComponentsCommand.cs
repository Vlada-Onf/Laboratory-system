using Application.Components.Exceptions;
using Domain.Components;
using LanguageExt;
using MediatR;

namespace Application.Components.Commands.ImportAiComponents
{
    public record ImportAiComponentsCommand : IRequest<Either<ComponentException, List<Component>>>
    {
        public required Guid CategoryId { get; init; }
        public required Guid CreatedBy { get; init; }
        public required Guid PerformedBy { get; init; }
        public required List<ImportAiItemData> Items { get; init; }
    }

    public record ImportAiItemData
    {
        public required string Name { get; init; }
        public string Model { get; init; } = "";
        public string InventoryNumber { get; init; } = "";
        public string SerialNumber { get; init; } = "";
        public string State { get; init; } = "";
        public string Location { get; init; } = "";
        public string Notes { get; init; } = "";
    }
}