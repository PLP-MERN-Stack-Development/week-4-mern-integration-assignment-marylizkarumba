
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import PostCard from './PostCard';
import { useApi } from '@/hooks/useApi';
import { usePagination } from '@/hooks/usePagination';
import { Post } from '@/types/blog';

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  const { getAllPosts, loading, error, apiCall } = useApi();
  
  const {
    currentPage,
    totalPages,
    paginatedData,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage,
    hasPrevPage
  } = usePagination({ data: filteredPosts, itemsPerPage: 6 });

  useEffect(() => {
    const loadPosts = async () => {
      const result = await apiCall(getAllPosts);
      if (result) {
        setPosts(result);
        setFilteredPosts(result);
      }
    };
    
    loadPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;
    
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Sort posts
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedCategory, sortOrder]);

  const categories = ['Development', 'Design', 'Backend'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="text-center py-12">
          <p className="text-red-600 mb-4">Error loading posts: {error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
          Latest Blog Posts
        </h1>
        <p className="text-xl text-gray-600">Discover insights, tutorials, and stories from our community</p>
      </div>

      <Card className="mb-8 border-purple-100 shadow-lg">
        <CardContent className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search posts, authors, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-purple-200 focus:border-purple-400"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('')}
                size="sm"
                className={selectedCategory === '' ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-200 hover:bg-purple-50'}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                  className={selectedCategory === category ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-200 hover:bg-purple-50'}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant={sortOrder === 'newest' ? 'default' : 'outline'}
                onClick={() => setSortOrder('newest')}
                size="sm"
                className={sortOrder === 'newest' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-200 hover:bg-blue-50'}
              >
                Newest
              </Button>
              <Button
                variant={sortOrder === 'oldest' ? 'default' : 'outline'}
                onClick={() => setSortOrder('oldest')}
                size="sm"
                className={sortOrder === 'oldest' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-200 hover:bg-blue-50'}
              >
                Oldest
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredPosts.length === 0 ? (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="text-center py-12">
            <p className="text-yellow-700 text-lg">No posts found matching your criteria.</p>
            <p className="text-yellow-600 mt-2">Try adjusting your search or filters.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedData.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={prevPage} 
                      className={!hasPrevPage ? 'pointer-events-none opacity-50' : 'hover:bg-purple-100 cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        onClick={() => goToPage(page)}
                        isActive={currentPage === page}
                        className={currentPage === page ? 'bg-purple-600 text-white' : 'hover:bg-purple-100 cursor-pointer'}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={nextPage} 
                      className={!hasNextPage ? 'pointer-events-none opacity-50' : 'hover:bg-purple-100 cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          <div className="text-center mt-4 text-sm text-gray-600">
            Showing {paginatedData.length} of {filteredPosts.length} posts
          </div>
        </>
      )}
    </div>
  );
};

export default PostList;
