namespace Application.Components.Autofill;

public interface IComponentAutofillService
{
    Task<ComponentAutofillResult> SuggestAsync(
        ComponentAutofillInput input,
        CancellationToken cancellationToken);
}