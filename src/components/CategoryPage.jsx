import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Package, FileText, Music, GraduationCap, DollarSign, MapPin } from 'lucide-react';

function CategoryPage({ category, onBack }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const colleges = [
    'All Colleges',
    'Harvard University',
    'Stanford University',
    'MIT',
    'UC Berkeley',
    'Yale University',
    'Princeton University',
    'Columbia University',
    'University of Chicago'
  ];

  const priceRanges = [
    'All Prices',
    'Under $25',
    '$25 - $50',
    '$50 - $100',
    '$100 - $200',
    'Over $200'
  ];

  // Mock data for demonstration
  const getMockItems = () => {
    const baseItems = {
      goods: [
        { id: '1', title: 'MacBook Pro 2021', description: 'Excellent condition, barely used laptop perfect for coding and design work', price: 1200, seller: 'Alex Chen', college: 'Stanford University', condition: 'Like New' },
        { id: '2', title: 'Calculus Textbook', description: 'Stewart Calculus 8th Edition with solutions manual', price: 80, seller: 'Sarah Johnson', college: 'MIT', condition: 'Good' },
        { id: '3', title: 'Gaming Chair', description: 'Ergonomic gaming chair with lumbar support, great for long study sessions', price: 150, seller: 'Mike Wilson', college: 'UC Berkeley', condition: 'Very Good' },
        { id: '4', title: 'iPad Air', description: '64GB WiFi model with Apple Pencil included', price: 400, seller: 'Emma Davis', college: 'Harvard University', condition: 'Excellent' },
      ],
      'digital-notes': [
        { id: '5', title: 'CS50 Complete Notes', description: 'Comprehensive notes covering all CS50 lectures and problem sets', price: 25, seller: 'David Kim', college: 'Harvard University' },
        { id: '6', title: 'Organic Chemistry Study Guide', description: 'Detailed study materials for CHEM 20A with practice problems', price: 35, seller: 'Lisa Wang', college: 'Stanford University' },
        { id: '7', title: 'Linear Algebra Notes', description: 'MIT 18.06 lecture notes with worked examples and proofs', price: 20, seller: 'John Smith', college: 'MIT' },
        { id: '8', title: 'Psychology 101 Summary', description: 'Condensed notes covering all major psychology concepts and theories', price: 15, seller: 'Rachel Green', college: 'Yale University' },
      ],
      playlists: [
        { id: '9', title: 'Study Focus Playlist', description: 'Lo-fi and ambient tracks perfect for deep focus sessions', price: 5, seller: 'Chris Taylor', college: 'Princeton University' },
        { id: '10', title: 'Workout Motivation Mix', description: 'High-energy tracks to power through your gym sessions', price: 8, seller: 'Jordan Lee', college: 'Columbia University' },
        { id: '11', title: 'Chill Indie Vibes', description: 'Curated indie and alternative tracks for relaxing', price: 6, seller: 'Sam Rodriguez', college: 'UC Berkeley' },
        { id: '12', title: 'Classical Study Music', description: 'Baroque and classical pieces proven to enhance concentration', price: 10, seller: 'Ashley Brown', college: 'University of Chicago' },
      ]
    };
    
    return baseItems[category] || [];
  };

  const items = getMockItems();

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollege = !selectedCollege || selectedCollege === 'All Colleges' || item.college === selectedCollege;
    
    let matchesPrice = true;
    if (priceRange && priceRange !== 'All Prices') {
      switch (priceRange) {
        case 'Under $25':
          matchesPrice = item.price < 25;
          break;
        case '$25 - $50':
          matchesPrice = item.price >= 25 && item.price <= 50;
          break;
        case '$50 - $100':
          matchesPrice = item.price >= 50 && item.price <= 100;
          break;
        case '$100 - $200':
          matchesPrice = item.price >= 100 && item.price <= 200;
          break;
        case 'Over $200':
          matchesPrice = item.price > 200;
          break;
      }
    }
    
    return matchesSearch && matchesCollege && matchesPrice;
  });

  const getCategoryIcon = () => {
    switch (category) {
      case 'goods': return Package;
      case 'digital-notes': return FileText;
      case 'playlists': return Music;
      default: return Package;
    }
  };

  const getCategoryName = () => {
    switch (category) {
      case 'goods': return 'Goods';
      case 'digital-notes': return 'Digital Notes';
      case 'playlists': return 'Playlists';
      default: return 'Items';
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'goods': return 'blue';
      case 'digital-notes': return 'green';
      case 'playlists': return 'purple';
      default: return 'blue';
    }
  };

  const CategoryIcon = getCategoryIcon();
  const categoryColor = getCategoryColor();

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-${categoryColor}-600 rounded-xl flex items-center justify-center`}>
              <CategoryIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{getCategoryName()}</h1>
              <p className="text-gray-600">{filteredItems.length} items available</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${getCategoryName().toLowerCase()}...`}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-5 w-5 text-gray-600" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">College</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedCollege}
                    onChange={(e) => setSelectedCollege(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    {colleges.map((college) => (
                      <option key={college} value={college}>
                        {college}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    {priceRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
              <div className={`h-48 bg-gradient-to-br from-${categoryColor}-100 to-${categoryColor}-200 flex items-center justify-center`}>
                <CategoryIcon className={`h-16 w-16 text-${categoryColor}-600`} />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">${item.price}</div>
                    {item.condition && (
                      <span className="text-xs text-gray-500">{item.condition}</span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{item.seller}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GraduationCap className="h-4 w-4" />
                    <span className="truncate max-w-32">{item.college}</span>
                  </div>
                </div>
                
                <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Contact Seller
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <CategoryIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;