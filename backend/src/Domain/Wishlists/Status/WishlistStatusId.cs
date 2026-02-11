namespace Domain.Wishlists.Status
{
    public record WishlistStatusId(Guid Value)
    {
        public static WishlistStatusId New() => new(Guid.NewGuid());
        public static WishlistStatusId Empty() => new(Guid.Empty);
        public override string ToString() => Value.ToString();
    }
}
