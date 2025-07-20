import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../Auth/AuthModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ show: boolean; mode: 'signin' | 'signup' }>({ 
    show: false, 
    mode: 'signin' 
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [forceShowButtons, setForceShowButtons] = useState(false);
  const location = useLocation();
  const { user, signOut, isAdministrator, isFarmUser, loading } = useAuth();

  // Force show sign-in buttons if loading takes too long
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (loading && !user) {
      timeoutId = setTimeout(() => {
        console.warn('Auth loading timeout - forcing buttons to show');
        setForceShowButtons(true);
      }, 5000); // 5 seconds timeout
    } else {
      setForceShowButtons(false);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [loading, user]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const userMenuButton = document.getElementById('user-menu-button');
      const userMenuDropdown = document.getElementById('user-menu-dropdown');
      
      if (showUserMenu && 
          userMenuButton && 
          userMenuDropdown &&
          !userMenuButton.contains(event.target as Node) &&
          !userMenuDropdown.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close auth modal when user becomes authenticated
  useEffect(() => {
    if (user && authModal.show) {
      console.log('User authenticated, closing auth modal');
      setAuthModal({ show: false, mode: 'signin' });
    }
  }, [user, authModal.show]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Our Animals', href: '/products' },
    { name: 'Education', href: '/education' },
    { name: 'Contact', href: '/contact' }
  ];

  // Add management link for farm users and administrators
  if (user && (isFarmUser() || isAdministrator())) {
    navigation.push({ name: 'Management', href: '/management' });
  }

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      console.log('Initiating sign out...');
      await signOut();
      setShowUserMenu(false);
      console.log('Sign out completed');
    } catch (error) {
      console.error('Error signing out:', error);
      setShowUserMenu(false);
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'administrator': return 'Administrator';
      case 'farm': return 'Farm Manager';
      case 'customer': return 'Customer';
      default: return 'User';
    }
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    console.log('Opening auth modal in mode:', mode);
    setAuthModal({ show: true, mode });
    setIsMenuOpen(false);
  };

  const closeAuthModal = () => {
    console.log('Closing auth modal');
    setAuthModal({ show: false, mode: 'signin' });
  };

  // Determine what to show in the auth section
  const showLoadingState = loading && !user && !forceShowButtons;
  const showAuthButtons = !user && (forceShowButtons || !loading);

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-green-600 p-2 rounded-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">iFarm</h1>
                <p className="text-sm text-green-600 font-medium">Livestock Farm</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {showLoadingState ? (
                <div className="flex items-center space-x-2 px-3 py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : user ? (
                <div className="relative">
                  <button
                    id="user-menu-button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
                  >
                    <User className="h-4 w-4" />
                    <span>{user.full_name || user.email}</span>
                  </button>

                  {showUserMenu && (
                    <div 
                      id="user-menu-dropdown"
                      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {user.full_name || user.email}
                        </p>
                        <p className="text-xs text-gray-500">{getRoleLabel(user.role)}</p>
                      </div>
                      
                      {(isFarmUser() || isAdministrator()) && (
                        <Link
                          to="/management"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Management Dashboard
                        </Link>
                      )}
                      
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : showAuthButtons ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => openAuthModal('signin')}
                    className="text-green-600 hover:text-green-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 border border-green-600 hover:bg-green-50"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </div>
              ) : null}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Mobile Navigation Links */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile User Menu */}
                <div className="border-t border-gray-200 mt-2 pt-2">
                  {showLoadingState ? (
                    <div className="flex items-center px-3 py-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                      <span className="text-sm text-gray-500">Loading...</span>
                    </div>
                  ) : user ? (
                    <>
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium text-gray-900">
                          {user.full_name || user.email}
                        </p>
                        <p className="text-xs text-gray-500">{getRoleLabel(user.role)}</p>
                      </div>
                      {(isFarmUser() || isAdministrator()) && (
                        <Link
                          to="/management"
                          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Management Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => openAuthModal('signin')}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-green-600 hover:bg-green-50"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => openAuthModal('signup')}
                        className="block w-full text-left px-3 py-2 text-base font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 mx-3"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={authModal.show} 
        onClose={closeAuthModal} 
        initialMode={authModal.mode}
      />
    </>
  );
}