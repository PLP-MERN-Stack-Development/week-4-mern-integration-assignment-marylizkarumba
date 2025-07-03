
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Post, Category } from '@/types/blog';

interface BlogState {
  posts: Post[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  optimisticUpdates: Record<string, Post>;
}

type BlogAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST'; payload: Post }
  | { type: 'DELETE_POST'; payload: string }
  | { type: 'ADD_OPTIMISTIC_UPDATE'; payload: { id: string; post: Post } }
  | { type: 'REMOVE_OPTIMISTIC_UPDATE'; payload: string };

const initialState: BlogState = {
  posts: [],
  categories: [],
  loading: false,
  error: null,
  optimisticUpdates: {}
};

const blogReducer = (state: BlogState, action: BlogAction): BlogState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_POSTS':
      return { ...state, posts: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id ? action.payload : post
        )
      };
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload)
      };
    case 'ADD_OPTIMISTIC_UPDATE':
      return {
        ...state,
        optimisticUpdates: {
          ...state.optimisticUpdates,
          [action.payload.id]: action.payload.post
        }
      };
    case 'REMOVE_OPTIMISTIC_UPDATE':
      const { [action.payload]: removed, ...rest } = state.optimisticUpdates;
      return { ...state, optimisticUpdates: rest };
    default:
      return state;
  }
};

interface BlogContextType {
  state: BlogState;
  dispatch: React.Dispatch<BlogAction>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(blogReducer, initialState);

  return (
    <BlogContext.Provider value={{ state, dispatch }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlogContext must be used within a BlogProvider');
  }
  return context;
};
