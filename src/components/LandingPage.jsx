import React from 'react';
import { ShoppingCart, Package } from 'lucide-react';

function LandingPage({ onSellClick, onBuyClick }) {
  return (
    <div className="h-screen w-screen relative bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center px-4 overflow-hidden">


      
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-black opacity-40 pointer-events-none"></div>
      
      {/* Hero content */}
      <div className="relative text-center text-white max-w-2xl space-y-8 animate-fade-in">
        
        {/* Professional heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
          The Student Marketplace
        </h1>

        {/* Subheading / description */}
        <p className="text-lg sm:text-xl text-blue-200">
          Buy, sell and Donate Books, Notes and Essentials with verified students.
          Simple, safe, and built for your ease.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-4">
          <button
            onClick={onBuyClick}
            className="group px-8 py-4 bg-white text-blue-800 rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 min-w-[200px]"
          >
            <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
            <span>Start Buying</span>
          </button>
          
          <button
            onClick={onSellClick}
            className="group px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 min-w-[200px]"
          >
            <Package className="h-6 w-6 group-hover:scale-110 transition-transform" />
            <span>Start Selling</span>
          </button>
        </div>
      </div>

      {/* Tailwind Animations */}
      <style>
        {`
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 2s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}

export default LandingPage;
