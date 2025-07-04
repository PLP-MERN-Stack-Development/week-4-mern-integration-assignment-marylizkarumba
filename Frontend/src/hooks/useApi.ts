
import { useState, useEffect } from 'react';
import { Post, Category, ApiResponse } from '@/types/blog';

// Mock data for demonstration
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    content: 'React with TypeScript provides excellent type safety and developer experience. In this comprehensive guide, we\'ll explore how to set up a React project with TypeScript and build robust applications.',
    excerpt: 'Learn how to build robust React applications with TypeScript for better type safety and developer experience.',
    author: 'John Doe',
    category: 'Development',
    tags: ['React', 'TypeScript', 'Frontend'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop'
  },
  {
    id: '2',
    title: 'Modern CSS Techniques for Better UX',
    content: 'CSS has evolved significantly over the years. Modern CSS features like Grid, Flexbox, and CSS Variables allow us to create beautiful, responsive designs with less code.',
    excerpt: 'Explore modern CSS features that will help you create stunning user interfaces.',
    author: 'Jane Smith',
    category: 'Design',
    tags: ['CSS', 'Design', 'UX'],
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=400&fit=crop'
  },
  {
    id: '3',
    title: 'Building Scalable APIs with Node.js',
    content: 'Learn how to build robust and scalable APIs using Node.js and Express. We\'ll cover best practices, error handling, and performance optimization.',
    excerpt: 'Best practices for building scalable and maintainable APIs with Node.js.',
    author: 'Mike Johnson',
    category: 'Backend',
    tags: ['Node.js', 'API', 'Backend'],
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop'
  }
];

const mockCategories: Category[] = [
  { id: '1', name: 'Development', description: 'Programming and software development' },
  { id: '2', name: 'Design', description: 'UI/UX and graphic design' },
  { id: '3', name: 'Backend', description: 'Server-side development' }
];

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = async <T>(
    apiFunction: () => Promise<T>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Mock API functions
  const getAllPosts = async (): Promise<Post[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return mockPosts;
  };

  const getPostById = async (id: string): Promise<Post | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPosts.find(post => post.id === id) || null;
  };

  const createPost = async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockPosts.unshift(newPost);
    return newPost;
  };

  const updatePost = async (id: string, postData: Partial<Post>): Promise<Post | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockPosts.findIndex(post => post.id === id);
    if (index === -1) return null;
    
    mockPosts[index] = { ...mockPosts[index], ...postData, updatedAt: new Date().toISOString() };
    return mockPosts[index];
  };

  const deletePost = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockPosts.findIndex(post => post.id === id);
    if (index === -1) return false;
    
    mockPosts.splice(index, 1);
    return true;
  };

  const getAllCategories = async (): Promise<Category[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCategories;
  };

  return {
    loading,
    error,
    apiCall,
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getAllCategories
  };
};
