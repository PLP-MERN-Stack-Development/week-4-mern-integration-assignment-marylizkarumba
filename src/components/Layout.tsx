
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
      <header className="bg-white shadow-lg border-b border-purple-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent hover:from-purple-700 hover:via-blue-700 hover:to-teal-700 transition-all duration-300">
              InkFlow Blog
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`font-medium transition-all duration-300 ${
                  isActive('/') 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : 'text-gray-600 hover:text-purple-600 hover:border-b-2 hover:border-purple-300'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/create" 
                className={`font-medium transition-all duration-300 ${
                  isActive('/create') 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : 'text-gray-600 hover:text-purple-600 hover:border-b-2 hover:border-purple-300'
                }`}
              >
                Write
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg">
                <Link to="/create">New Post</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
            InkFlow Blog
          </h3>
          <p className="text-gray-300">&copy; 2025 InkFlow Blog. Built with React, TypeScript, and ❤️</p>
          <div className="mt-4 flex justify-center space-x-6">
            <span className="text-purple-300">✨ Discover</span>
            <span className="text-blue-300">📝 Create</span>
            <span className="text-teal-300">🌟 Share</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
