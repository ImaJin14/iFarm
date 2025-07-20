import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, User, LogOut, Settings, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../Auth/AuthModal';

interface HeaderProps {
  forceShowButtons?: boolean;
}

export default function Header({ forceShowButtons = false }: HeaderProps) {
  const { user, loading, signOut, isAdministrator, isFarmUser, refreshUserProfile } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [authModal, setAuthModal] = useState({ show: false, mode: 'signin' as 'signin' | 'signup' });
  const [refreshing, setRefreshing] = useState(false);
  const location = useLocation();

  // Close auth modal when user becomes authenticated
  useEffect(() => {
    if (user && authModal.show) {
      console.log('User authenticated, closing auth modal');
      setAuthModal({ show: false, mode: 'signin' });
    }
  }, [user, authModal.show]);

  // Base navigation items
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Our Animals', href: '/products' },
    { name: 'Education', href: '/education' },
    { name: 'Contact', href: '/contact' }
  ];

  // Add management link for farm users and administrators with better logging
  const shouldShowManagement = user && (isFarmUser() || isAdministrator());
  
  if (shouldShowManagement) {
    console.log(`Adding Management tab for user role: ${user.role}`);
    navigation.push({ name: 'Management', href: '/management' });
  } else if (user) {
    console.log(`Not showing Management tab for user role: ${user.role}`);
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

  const handleRefreshProfile = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    try {
      console.log('Refreshing user profile...');
      await refreshUserProfile();
      console.log('Profile refresh completed');
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setRefreshing(false);
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

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'administrator': return 'bg-red-100 text-red-800';
      case 'farm': return 'bg-green-100 text-green-800';
      case 'customer': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                  {item.name === 'Management' && (
                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user?.role)}`}>
                      {getRoleLabel(user?.role)}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {showLoadingState && (
                <div className="text-sm text-gray-500">Loading...</div>
              )}
              
              {showAuthButtons && (
                <>
                  <button
                    onClick={() => openAuthModal('signin')}
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </>
              )}

              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">
                      {user.full_name || user.email?.split('@')[0]}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {user.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                          <span className="text-xs text-gray-400">ID: {user.id.slice(0, 8)}...</span>
                        </div>
                      </div>
                      
                      {/* Debug info in development */}
                      {process.env.NODE_ENV === 'development' && (
                        <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                          <p className="text-xs text-gray-600 font-medium">Debug Info:</p>
                          <p className="text-xs text-gray-500">
                            Farm User: {isFarmUser() ? 'Yes' : 'No'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Administrator: {isAdministrator() ? 'Yes' : 'No'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Should Show Management: {shouldShowManagement ? 'Yes' : 'No'}
                          </p>
                        </div>
                      )}
                      
                      <button
                        onClick={handleRefreshProfile}
                        disabled={refreshing}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Refreshing...' : 'Refresh Profile'}
                      </button>
                      
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4 mr-2 inline" />
                        Profile Settings
                      </Link>
                      
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive(item.href)
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                    {item.name === 'Management' && (
                      <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user?.role)}`}>
                        {getRoleLabel(user?.role)}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth Section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                {showAuthButtons && (
                  <div className="space-y-2">
                    <button
                      onClick={() => openAuthModal('signin')}
                      className="w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => openAuthModal('signup')}
                      className="w-full bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                      Sign Up
                    </button>
                  </div>
                )}

                {user && (
                  <div className="space-y-2">
                    <div className="px-3 py-2 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium text-gray-900">
                        {user.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${getRoleBadgeColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                    
                    <button
                      onClick={handleRefreshProfile}
                      disabled={refreshing}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                      {refreshing ? 'Refreshing...' : 'Refresh Profile'}
                    </button>
                    
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2 inline" />
                      Profile Settings
                    </Link>
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.show}
        mode={authModal.mode}
        onClose={closeAuthModal}
        onToggleMode={(mode) => setAuthModal({ ...authModal, mode })}
      />
    </>
  );
}