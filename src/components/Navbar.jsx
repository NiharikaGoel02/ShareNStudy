import React from 'react';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Navbar({ user, onLogin, onSignup, onLogout, onHomeClick }) {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onHomeClick}
          >
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">ShareNStudy</span>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Profile */}
                <div 
                  className="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={goToProfile}
                >
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">{user.fullName}</span>
                </div>

                {/* Logout */}
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={onLogin}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors border border-white/20 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md"
                >
                  Login
                </button>
                <button
                  onClick={onSignup}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#122f6f] hover:bg-[#0e3b8f] rounded-md transition-colors shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
