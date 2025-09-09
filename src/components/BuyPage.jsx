// src/components/BuyPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, FileText, Music } from 'lucide-react';

function BuyPage() {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'books',
      name: 'Books',
      icon: Package,
      description: 'Buy textbooks and academic material',
      route: '/buy/books',
    },
    {
      id: 'digital-notes',
      name: 'Digital Notes',
      icon: FileText,
      description: 'Free & paid lecture notes, guides, and resources',
      route: '/buy/digital-notes',
    },
    {
      id: 'playlists',
      name: 'Playlists',
      icon: Music,
      description: 'Curated study & subject playlists',
      route: '/buy/playlists',
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Browse Marketplace</h1>
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

export default BuyPage;
