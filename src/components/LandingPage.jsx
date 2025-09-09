import React from 'react';
import { ShoppingCart, Package, TrendingUp, Users, Star, Shield } from 'lucide-react';

function LandingPage({ onSellClick, onBuyClick }) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              Your Campus
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Marketplace
              </span>
            </h1>
            <p className="text-xl sm:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto">
              Buy and sell goods, digital notes, and playlists with your fellow students. 
              Connect, trade, and build your campus community.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={onBuyClick}
                className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 min-w-[200px]"
              >
                <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                <span>Start Buying</span>
              </button>
              
              <button
                onClick={onSellClick}
                className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 min-w-[200px]"
              >
                <Package className="h-6 w-6 group-hover:scale-110 transition-transform" />
                <span>Start Selling</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for students, by students. Safe, easy, and designed for campus life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safe & Secure</h3>
              <p className="text-gray-600">College-verified users and secure transactions for peace of mind.</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Campus Community</h3>
              <p className="text-gray-600">Connect with students from your college and build lasting relationships.</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality First</h3>
              <p className="text-gray-600">Curated marketplace with quality items and trusted sellers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">1000+</div>
              <div className="text-gray-300">Active Students</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">5000+</div>
              <div className="text-gray-300">Items Listed</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2">50+</div>
              <div className="text-gray-300">Colleges</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-2">98%</div>
              <div className="text-gray-300">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;