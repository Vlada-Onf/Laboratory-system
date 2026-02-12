import { create } from 'zustand';
import { eventBus } from '../utils/eventBus';

export const useCommentsStore = create((set, get) => ({
  commentsByComponent: {},

  addComment: (componentId, text, componentName = 'компонент') => {
    if (!text?.trim() || !componentId){
      return;
    }

    const newComment = {
      id: crypto.randomUUID(),
      author: 'Ви',
      avatar: 'https://media.istockphoto.com/id/1550071750/photo/green-tea-tree-leaves-camellia-sinensis-in-organic-farm-sunlight-fresh-young-tender-bud.jpg?s=612x612&w=0&k=20&c=RC_xD5DY5qPH_hpqeOY1g1pM6bJgGJSssWYjVIvvoLw=',
      text: text.trim(),
      replies: [],
      createdAt: new Date().toISOString()
    };

    set((state) => ({
      commentsByComponent: {
        ...state.commentsByComponent,
        [componentId]: [newComment, ...(state.commentsByComponent[componentId] || [])]
      }
    }));

    eventBus.emit('entity:created', {
      time: new Date().toISOString(),
      userId: 'currentUser',
      userName: 'Дарина',
      entityTypeId: 6,
      entityTypeName: 'Коментар',
      entityId: newComment.id,
      entityName: `Коментар до ${componentName}`,
      actionName: 'Створено'
    });
  },

  updateComment: (componentId, commentId, text, componentName = 'компонент') => {
    if (!text?.trim() || !componentId || !commentId){
      return;
    }

    const getCurrentCommentText = (items) => {
      for (const comment of items) {
        if (comment.id === commentId){
          return comment.text.slice(0, 30);
        }

        if (comment.replies?.length){
          const replyText = getCurrentCommentText(comment.replies);
          if (replyText){
            return replyText;
          }
        }
      }
      return 'невідомий текст';
    };

    const currentComments = get().commentsByComponent[componentId] || [];
    const oldText = getCurrentCommentText(currentComments);

    const updateRecursively = (items) =>
      items.map((comment) =>
        comment.id === commentId
          ? { ...comment, text: text.trim() }
          : {
              ...comment,
              replies: comment.replies?.length
                ? updateRecursively(comment.replies)
                : []
            }
      );

    set((state) => ({
      commentsByComponent: {
        ...state.commentsByComponent,
        [componentId]: updateRecursively(state.commentsByComponent[componentId] || [])
      }
    }));

    eventBus.emit('entity:updated', {
      time: new Date().toISOString(),
      userId: 'currentUser',
      userName: 'Дарина',
      entityTypeId: 6,
      entityTypeName: 'Коментар',
      entityId: commentId,
      entityName: `Коментар до ${componentName}`,
      fieldName: 'текст',
      oldValue: oldText,
      newValue: text.trim().slice(0, 30)
    });
  },

  replyToComment: (componentId, commentId, text, componentName = 'компонент') => {
    if (!text?.trim() || !componentId || !commentId) return;

    const newReply = {
      id: crypto.randomUUID(),
      author: 'Ви',
      avatar: 'https://media.istockphoto.com/id/1550071750/photo/green-tea-tree-leaves-camellia-sinensis-in-organic-farm-sunlight-fresh-young-tender-bud.jpg?s=612x612&w=0&k=20&c=RC_xD5DY5qPH_hpqeOY1g1pM6bJgGJSssWYjVIvvoLw=',
      text: text.trim(),
      replies: [],
      createdAt: new Date().toISOString()
    };

    const addReplyRecursively = (items) =>
      items.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...(comment.replies || []), newReply] }
          : {
              ...comment,
              replies: comment.replies?.length
                ? addReplyRecursively(comment.replies)
                : []
            }
      );

    set((state) => ({
      commentsByComponent: {
        ...state.commentsByComponent,
        [componentId]: addReplyRecursively(state.commentsByComponent[componentId] || [])
      }
    }));

    eventBus.emit('entity:created', {
      time: new Date().toISOString(),
      userId: 'currentUser',
      userName: 'Дарина',
      entityTypeId: 6,
      entityTypeName: 'Коментар',
      entityId: newReply.id,
      entityName: `Коментар до ${componentName}`,
      actionName: 'Створено'
    });
  },

  deleteComment: (componentId, commentId, componentName = 'компонент') => {
    if (!componentId || !commentId){
      return;
    }

    const deleteRecursively = (items) =>
      items
        .filter((comment) => comment.id !== commentId)
        .map((comment) => ({
          ...comment,
          replies: comment.replies?.length
            ? deleteRecursively(comment.replies)
            : []
        }));

    set((state) => ({
      commentsByComponent: {
        ...state.commentsByComponent,
        [componentId]: deleteRecursively(state.commentsByComponent[componentId] || [])
      }
    }));

    eventBus.emit('entity:deleted', {
      time: new Date().toISOString(),
      userId: 'currentUser',
      userName: 'Дарина',
      entityTypeId: 6,
      entityTypeName: 'Коментар',
      entityId: commentId,
      entityName: `Коментар до ${componentName}`,
      actionName: 'Видалено'
    });
  },

  clearComments: (componentId) => {
    if (!componentId){
      return;
    }
    set((state) => ({
      commentsByComponent: {
        ...state.commentsByComponent,
        [componentId]: []
      }
    }));
  }
}));
