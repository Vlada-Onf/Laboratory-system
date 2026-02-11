using Domain.Tags;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Tags.Exceptions
{
    public abstract class TagException(
            TagId tagId,
            string message,
            Exception? innerException = null)
            : Exception(message, innerException)
    {
        public TagId TagId { get; } = tagId;
    }

    public class TagAlreadyExistException(TagId tagId)
        : TagException(tagId, $"Tag already exists under id {tagId}");

    public class TagNotFoundException(TagId tagId)
        : TagException(tagId, $"Tag not found under id {tagId}");

    public class UnhandledTagException(TagId tagId, Exception? innerException = null)
        : TagException(tagId, "Unexpected error occurred", innerException);
}