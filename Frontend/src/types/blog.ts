
export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
