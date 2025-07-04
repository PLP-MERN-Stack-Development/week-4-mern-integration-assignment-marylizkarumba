import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Comments from './Comments';
import { useApi } from '@/hooks/useApi';
import { Post, Comment } from '@/types/blog';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const { getPostById, deletePost, loading, error, apiCall } = useApi();

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      const result = await apiCall(() => getPostById(id));
      if (result) {
        setPost(result);
        setComments(result.comments || []);
      }
    };
    
    loadPost();
  }, [id]);

  const handleAddComment = (commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setComments(prev => [newComment, ...prev]);
  };

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this post?')) return;
    
    const result = await apiCall(() => deletePost(id));
    if (result) {
      navigate('/');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="text-center py-12">
          <p className="text-red-600 mb-4">
            {error || 'Post not found'}
          </p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" asChild className="mb-4 border-purple-200 hover:bg-purple-50">
          <Link to="/">← Back to Posts</Link>
        </Button>
      </div>

      <article>
        {post.imageUrl && (
          <div className="aspect-video overflow-hidden rounded-lg mb-8 shadow-lg">
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
              {post.category}
            </span>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild className="border-purple-200 hover:bg-purple-50">
                <Link to={`/edit/${post.id}`}>Edit</Link>
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                Delete
              </Button>
            </div>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            {post.title}
          </h1>

          <div className="flex items-center text-gray-600 mb-4">
            <span>By {post.author}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(post.createdAt)}</span>
            {post.updatedAt !== post.createdAt && (
              <>
                <span className="mx-2">•</span>
                <span className="text-sm">Updated {formatDate(post.updatedAt)}</span>
              </>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 px-3 py-1 rounded-full text-sm shadow-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <Card className="shadow-lg border-purple-100">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Comments 
          postId={post.id} 
          comments={comments} 
          onAddComment={handleAddComment} 
        />
      </article>
    </div>
  );
};

export default PostDetail;
