import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/contexts/AuthContext'
import { Toaster } from '@/components/ui/toaster'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const doLogout = async () => {
    try {
      await logout();
      // Redirect to home page using react-router
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600">
                SimpleBlog
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link 
                to="/" 
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link 
                to="/category/technologia" 
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Technologia
              </Link>
              <Link 
                to="/category/styl-zycia" 
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Styl życia
              </Link>
            </nav>

            { isAuthenticated && (
                <div className="flex items-center space-x-4">
                <button 
                    onClick={doLogout}
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                    Wyloguj się
                </button>
                <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Panel użytkownika
                </Link>
                </div>
            ) }
            { !isAuthenticated && (
                <div className="flex items-center space-x-4">
                <Link 
                    to="/auth/login"
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                    Zaloguj się
                </Link>
                <Link 
                    to="/auth/register"
                    className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                    Zarejestruj się
                </Link>
                </div>
            ) }
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SimpleBlog</h3>
              <p className="text-gray-600 max-w-md">
                Nowoczesna platforma blogowa stworzona z wykorzystaniem najnowszych technologii. 
                Dziel się swoimi przemyśleniami i odkrywaj fascynujące treści.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Kategorie
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/category/technologia" className="text-gray-600 hover:text-gray-900">
                    Technologia
                  </Link>
                </li>
                <li>
                  <Link to="/category/styl-zycia" className="text-gray-600 hover:text-gray-900">
                    Styl życia
                  </Link>
                </li>
                <li>
                  <Link to="/category/podroze" className="text-gray-600 hover:text-gray-900">
                    Podróże
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Konto
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900">
                    Zaloguj się
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-600 hover:text-gray-900">
                    Zarejestruj się
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                    Panel użytkownika
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 mt-8">
            <p className="text-center text-gray-600 text-sm">
              © 2023 SimpleBlog. Wszystkie prawa zastrzeżone.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}