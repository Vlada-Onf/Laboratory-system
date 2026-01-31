import { useState } from 'react';
import { commentsMock } from './../mock/commentMock';

export const useComments = () => {
  const [comments, setComments] = useState(commentsMock);

  const updateComment = (id, text) => {
    const updateRecursively = (items) => {
      return items.map((c) => {
        if (c.id === id) {
          return { ...c, text: text };
        }
        if (c.replies) {
          return { ...c, replies: updateRecursively(c.replies) };
        }
        return c;
      });
    };
    setComments(updateRecursively(comments));
  };

  const replyToComment = (id, text) => {
    const addReplyRecursively = (items) => {
      return items.map((c) => {
        if (c.id === id) {
          const newReply = {
            id: Date.now(),
            author: 'Ви',
            avatar: 'https://media.istockphoto.com/id/1550071750/photo/green-tea-tree-leaves-camellia-sinensis-in-organic-farm-sunlight-fresh-young-tender-bud.jpg?s=612x612&w=0&k=20&c=RC_xD5DY5qPH_hpqeOY1g1pM6bJgGJSssWYjVIvvoLw=',
            text: text,
            replies: [],
          };
          return { ...c, replies: [...(c.replies || []), newReply] };
        }
        if (c.replies) {
          return { ...c, replies: addReplyRecursively(c.replies) };
        }
        return c;
      });
    };
    setComments(addReplyRecursively(comments));
  };

  const addComment = (text) => {
    if (!text.trim()) {
      return;
    }
    const comment = {
      id: Date.now(),
      author: 'Ви',
      avatar: 'https://media.istockphoto.com/id/1550071750/photo/green-tea-tree-leaves-camellia-sinensis-in-organic-farm-sunlight-fresh-young-tender-bud.jpg?s=612x612&w=0&k=20&c=RC_xD5DY5qPH_hpqeOY1g1pM6bJgGJSssWYjVIvvoLw=',
      text: text.trim(),
      replies: [],
    };
    setComments([comment, ...comments]);
  };

  const deleteComment = (id) => {
    const deleteRecursively = (items) => {
      return items
        .filter((c) => c.id !== id)
        .map((c) => {
          if (c.replies) {
            return { ...c, replies: deleteRecursively(c.replies) };
          }
          return c;
        });
    };
    setComments(deleteRecursively(comments));
  };

  return {
    comments: comments,
    addComment: addComment,
    updateComment: updateComment,
    replyToComment: replyToComment,
    deleteComment: deleteComment,
  };
};
