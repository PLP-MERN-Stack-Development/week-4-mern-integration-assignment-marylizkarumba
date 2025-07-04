
import { useState } from 'react';
import { ApiService } from '@/services/api';
import { useBlogContext } from '@/context/BlogContext';
import { Post } from '@/types/blog';
import { toast } from '@/hooks/use-toast';

export const useOptimisticApi = () => {
  const { dispatch } = useBlogContext();
  const [loading, setLoading] = useState(false);

  const createPostOptimistic = async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticPost: Post = {
      ...postData,
      id: tempId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      setLoading(true);
      
      // Add optimistic update
      dispatch({ type: 'ADD_OPTIMISTIC_UPDATE', payload: { id: tempId, post: optimisticPost } });
      dispatch({ type: 'ADD_POST', payload: optimisticPost });

      // Make actual API call
      const realPost = await ApiService.createPost(postData);
      
      // Remove optimistic update and add real post
      dispatch({ type: 'REMOVE_OPTIMISTIC_UPDATE', payload: tempId });
      dispatch({ type: 'DELETE_POST', payload: tempId });
      dispatch({ type: 'ADD_POST', payload: realPost });

      toast({
        title: "Success",
        description: "Post created successfully!",
      });

      return realPost;
    } catch (error) {
      // Revert optimistic update on error
      dispatch({ type: 'REMOVE_OPTIMISTIC_UPDATE', payload: tempId });
      dispatch({ type: 'DELETE_POST', payload: tempId });
      
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePostOptimistic = async (id: string, postData: Partial<Post>) => {
    try {
      setLoading(true);
      
      // Make API call and update immediately
      const updatedPost = await ApiService.updatePost(id, postData);
      if (updatedPost) {
        dispatch({ type: 'UPDATE_POST', payload: updatedPost });
        
        toast({
          title: "Success",
          description: "Post updated successfully!",
        });
      }
      
      return updatedPost;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePostOptimistic = async (id: string) => {
    try {
      setLoading(true);
      
      // Optimistically remove from UI
      dispatch({ type: 'DELETE_POST', payload: id });
      
      // Make API call
      await ApiService.deletePost(id);
      
      toast({
        title: "Success",
        description: "Post deleted successfully!",
      });
      
      return true;
    } catch (error) {
      // Could revert here by re-fetching posts
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createPostOptimistic,
    updatePostOptimistic,
    deletePostOptimistic
  };
};
