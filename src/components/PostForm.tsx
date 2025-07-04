import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ApiService } from '@/services/api';
import { useOptimisticApi } from '@/hooks/useOptimisticApi';
import { validateForm, postValidationSchema, ValidationErrors } from '@/utils/validation';
import { Post } from '@/types/blog';

const PostForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    category: 'Development',
    tags: '',
    imageUrl: ''
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { createPostOptimistic, updatePostOptimistic, loading: optimisticLoading } = useOptimisticApi();

  useEffect(() => {
    if (isEditing && id) {
      const loadPost = async () => {
        setIsLoading(true);
        try {
          const result = await ApiService.getPostById(id);
          if (result) {
            setFormData({
              title: result.title,
              content: result.content,
              excerpt: result.excerpt,
              author: result.author,
              category: result.category,
              tags: result.tags.join(', '),
              imageUrl: result.imageUrl || ''
            });
          }
        } catch (error) {
          console.error('Error loading post:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadPost();
    }
  }, [isEditing, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const { [name]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm(formData, postValidationSchema);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const postData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      excerpt: formData.excerpt.trim() || formData.content.slice(0, 150) + '...',
      author: formData.author.trim(),
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      imageUrl: formData.imageUrl.trim()
    };

    try {
      if (isEditing && id) {
        await updatePostOptimistic(id, postData);
        navigate(`/post/${id}`);
      } else {
        const newPost = await createPostOptimistic(postData);
        navigate('/');
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const categories = ['Development', 'Design', 'Backend'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl border-purple-100">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
          <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-purple-700 font-medium">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter post title"
                className={`border-purple-200 focus:border-purple-400 ${validationErrors.title ? 'border-red-500' : ''}`}
              />
              {validationErrors.title && (
                <p className="text-red-500 text-sm">{validationErrors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={validationErrors.author ? 'border-red-500' : ''}
                />
                {validationErrors.author && (
                  <p className="text-red-500 text-sm">{validationErrors.author}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                type="url"
                className={validationErrors.imageUrl ? 'border-red-500' : ''}
              />
              {validationErrors.imageUrl && (
                <p className="text-red-500 text-sm">{validationErrors.imageUrl}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Brief description of your post (optional - will be auto-generated if empty)"
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md bg-background resize-vertical"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="React, TypeScript, Frontend (comma-separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <textarea
                id="content"
                name="content"  
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your post content here..."
                rows={12}
                className={`w-full px-3 py-2 border border-input rounded-md bg-background resize-vertical ${
                  validationErrors.content ? 'border-red-500' : ''
                }`}
              />
              {validationErrors.content && (
                <p className="text-red-500 text-sm">{validationErrors.content}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={optimisticLoading} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                {optimisticLoading ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(isEditing ? `/post/${id}` : '/')}
                className="border-purple-200 hover:bg-purple-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostForm;
