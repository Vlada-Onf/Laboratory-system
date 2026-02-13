using Domain.Components.Comment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Comment.Exceptions
{
    public abstract class ComponentCommentException(
            ComponentCommentId id,
            string message,
            Exception? innerException = null)
            : Exception(message, innerException)
    {
        public ComponentCommentId Id { get; } = id;
    }

    public sealed class ComponentCommentNotFoundException(ComponentCommentId id)
        : ComponentCommentException(id, $"Component comment not found under id {id}");

    public sealed class UnhandledComponentCommentException(
        ComponentCommentId id,
        Exception? innerException = null)
        : ComponentCommentException(id, "Unexpected error occurred", innerException);
}