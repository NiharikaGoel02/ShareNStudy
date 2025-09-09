import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

function AuthModal({ mode, onClose, onBack, onLogin, onSignup, onSwitchMode }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'login' ? 'Welcome Back' : 'Join MarketPlace'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          {mode === 'login' ? (
            <LoginForm onLogin={onLogin} />
          ) : (
            <SignupForm onSignup={onSignup} />
          )}

          {/* Switch */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {mode === 'login'
                ? "Don't have an account?"
                : 'Already have an account?'}
            </p>
            <button
              onClick={onSwitchMode}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {mode === 'login' ? 'Sign up here' : 'Sign in here'}
            </button>
          </div>

          {/* Footer Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex space-x-3">
            <button
              onClick={onBack}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
