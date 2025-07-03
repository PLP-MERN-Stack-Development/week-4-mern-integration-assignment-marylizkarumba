
import { Post, Category, ApiResponse } from '@/types/blog';

const API_BASE_URL = '/api'; // This would be your actual API URL

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
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
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
    createdAt: '2025-01-10T14:20:00Z',
    updatedAt: '2025-01-10T14:20:00Z',
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
    createdAt: '2025-01-05T09:15:00Z',
    updatedAt: '2025-01-05T09:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop'
  }
];

const mockCategories: Category[] = [
  { id: '1', name: 'Development', description: 'Programming and software development' },
  { id: '2', name: 'Design', description: 'UI/UX and graphic design' },
  { id: '3', name: 'Backend', description: 'Server-side development' }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Service Class
export class ApiService {
  // Posts endpoints
  static async getAllPosts(): Promise<Post[]> {
    await delay(500);
    return [...mockPosts];
  }

  static async getPostById(id: string): Promise<Post | null> {
    await delay(300);
    return mockPosts.find(post => post.id === id) || null;
  }

  static async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    await delay(800);
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockPosts.unshift(newPost);
    return newPost;
  }

  static async updatePost(id: string, postData: Partial<Post>): Promise<Post | null> {
    await delay(600);
    const index = mockPosts.findIndex(post => post.id === id);
    if (index === -1) throw new Error('Post not found');
    
    mockPosts[index] = { 
      ...mockPosts[index], 
      ...postData, 
      updatedAt: new Date().toISOString() 
    };
    return mockPosts[index];
  }

  static async deletePost(id: string): Promise<boolean> {
    await delay(400);
    const index = mockPosts.findIndex(post => post.id === id);
    if (index === -1) throw new Error('Post not found');
    
    mockPosts.splice(index, 1);
    return true;
  }

  // Categories endpoints
  static async getAllCategories(): Promise<Category[]> {
    await delay(200);
    return [...mockCategories];
  }

  static async createCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
    await delay(400);
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString()
    };
    mockCategories.push(newCategory);
    return newCategory;
  }
}
