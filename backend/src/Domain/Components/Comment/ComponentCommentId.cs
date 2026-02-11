
namespace Domain.Components.Comment
{
    public record ComponentCommentId(Guid Value)
    {
        public static ComponentCommentId New() => new(Guid.NewGuid());
        public static ComponentCommentId Empty() => new(Guid.Empty);
        public override string ToString() => Value.ToString();
    }
}
