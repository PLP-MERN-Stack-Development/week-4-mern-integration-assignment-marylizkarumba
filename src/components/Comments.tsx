
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Comment } from '@/types/blog';

interface CommentsProps {
  postId: string;
  comments: Comment[];
  onAddComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
}

const Comments = ({ postId, comments, onAddComment }: CommentsProps) => {
  const [newComment, setNewComment] = useState({ author: '', content: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.author.trim() && newComment.content.trim()) {
      onAddComment({
        postId,
        author: newComment.author.trim(),
        content: newComment.content.trim()
      });
      setNewComment({ author: '', content: '' });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h3>

      <Card className="mb-8 border-purple-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardTitle className="text-lg text-purple-800">Add a Comment</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="author" className="text-purple-700">Your Name</Label>
              <Input
                id="author"
                value={newComment.author}
                onChange={(e) => setNewComment(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Enter your name"
                className="border-purple-200 focus:border-purple-400"
                required
              />
            </div>
            <div>
              <Label htmlFor="content" className="text-purple-700">Comment</Label>
              <textarea
                id="content"
                value={newComment.content}
                onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full px-3 py-2 border border-purple-200 rounded-md bg-background resize-vertical focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                required
              />
            </div>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Post Comment
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="border-l-4 border-l-purple-400 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-purple-800">{comment.author}</h4>
                <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{comment.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
};

export default Comments;
