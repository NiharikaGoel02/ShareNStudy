// src/components/SellPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, FileText, Music } from 'lucide-react';

function SellPage({ user, onLogin }) {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'books',
      name: 'Books',
      icon: Package,
      description: 'Physical books, academic material',
      route: '/sell/books',
    },
    {
      id: 'digital-notes',
      name: 'Digital Notes',
      icon: FileText,
      description: 'Free & paid digital notes',
      route: '/sell/digital-notes',
    },
    {
      id: 'playlists',
      name: 'Playlists',
      icon: Music,
      description: 'Subject-wise curated playlists',
      route: '/sell/playlists',
    },
  ];

  if (!user) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-600 mb-4">Please log in to access the seller page.</p>
        <button
          onClick={() => onLogin?.()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Sell Your Content</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer"
              onClick={() => navigate(cat.route)}
            >
              <div className="mb-4">
                <Icon className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">{cat.name}</h2>
              <p className="text-gray-600">{cat.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SellPage;
