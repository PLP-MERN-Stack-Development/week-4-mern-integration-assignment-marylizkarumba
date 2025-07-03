
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Post } from '@/types/blog';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden border-purple-100 hover:border-purple-200 group">
      {post.imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
            {post.category}
          </span>
          <span className="text-gray-600">{formatDate(post.createdAt)}</span>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
          <Link to={`/post/${post.id}`}>
            {post.title}
          </Link>
        </h2>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">By {post.author}</span>
          </div>
          
          <Button variant="outline" size="sm" asChild className="border-purple-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:border-purple-300">
            <Link to={`/post/${post.id}`}>
              Read More
            </Link>
          </Button>
        </div>
        
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="text-xs bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 px-2 py-1 rounded-full shadow-sm"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
