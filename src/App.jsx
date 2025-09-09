import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import SellPage from './components/SellPage';
import BuyPage from './components/BuyPage';
import CategoryPage from './components/CategoryPage';
import axios from 'axios';
import {BrowserRouter, Routes, Route, useNavigate, Navigate} from "react-router-dom"
import LoginForm from './components/LoginForm';
import BooksCategory from './components/BooksCategory';
import DigitalNotesCategory from './components/DigitalNotesCategory';
import FreeNotes from './components/FreeNotes';
import PaidNotes from './components/PaidNotes';
import PlaylistsCategory from './components/PlaylistsCategory';
import BuyBooks from './components/BuyBooks';
import BuyDigitalNotes from './components/BuyDigitalNotes';
import BuyPlaylist from './components/BuyPlaylist';
import UserPage from './components/UserPage'
import DonateBooks from './components/DonateBooks';

axios.defaults.withCredentials = true;

function AppWrapper(){
  return (
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  )
}

function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedCategory, setSelectedCategory] = useState('goods');
  const [authMode, setAuthMode] = useState('login');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      setUser(JSON.parse(storedUser));
    } else {
      // Clear invalid data to avoid future issues
      localStorage.removeItem('user');
    }
  } catch (err) {
    console.error("Failed to parse user from localStorage:", err);
    localStorage.removeItem('user');
  }
}, []);


  const handleLogin = async (userData) => {
  try {
    const url = '/api/v1/users/login';
    const response = await axios.post(url, userData, {
      withCredentials: true
    });
    console.log(response.data);
    setUser(userData); // optional: update login state
    localStorage.setItem('user', JSON.stringify(userData));
    setShowAuthModal(false);     // optional: close modal
  } catch (err) {
    console.error('Login failed', err);
  }
};

const handleSignup = async (userData) => {
  try {
    const response = await axios.post(
      '/api/v1/users/register',
      userData,
      { withCredentials: true }
    );
    console.log('Signup Success:', response.data);
    setUser(response.data.user); // Or adjust based on backend
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // After signup success, switch modal to login (or close modal)
    setAuthMode('login');     // switch modal to login mode
    // Or setShowAuthModal(false);  to just close modal if you want auto login
    
  } catch (error) {
    console.error('Signup Error:', error.response?.data || error.message);
    // handle error
  }
};






  const handleLogout = async () => {
  try {
    await axios.post("/api/v1/users/logout", {}, { withCredentials: true }); 
    // ^ tells backend to clear cookies and refreshToken
  } catch (err) {
    console.error("Logout failed:", err.response?.data || err.message);
  } finally {
    setUser(null);
    localStorage.removeItem("user");
    setCurrentPage("landing");
    navigate("/"); // optional: send back to home
  }
};


  const handleSellClick = () => {
    if (user) {
      navigate('/sell');
    } else {
      navigate('/sell')
      // setCurrentPage('sell');
      //setShowAuthModal(true);
      //setAuthMode('login');
    }
  };

  const handleBuyClick = () => {
    navigate('/buy');
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage('category');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
    setShowAuthModal(false);
  };

  const handleShowAuth = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

return (
    <>
      <Navbar
        user={user}
        onLogin={() => handleShowAuth('login')}
        onSignup={() => handleShowAuth('signup')}
        onLogout={handleLogout}
        onHomeClick={() => navigate('/')}
      />

      {showAuthModal && (
        <AuthModal
          mode={authMode}                     // ← This was missing!
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onSwitchMode={() =>
            setAuthMode((prev) => (prev === 'login' ? 'signup' : 'login'))
          }
          onBack={() => setShowAuthModal(false)}
        />
      )}

      <Routes>
        <Route path="/" element={<LandingPage onSellClick={handleSellClick}
      onBuyClick={handleBuyClick}/>} />
      <Route path="/login" element={<LoginForm />} /> 
        <Route path="/buy" element={<BuyPage />} />
        <Route path="/notes" element={<CategoryPage />} />
        <Route path="/sell" element={<SellPage user={user} onLogin={() => handleShowAuth("login")}/>} />
        <Route path="/sell/books" element={<BooksCategory user={user} onLogin={() => handleShowAuth("login")}/>} />
        <Route path="/sell/digital-notes" element={<DigitalNotesCategory user={user} onLogin={() => handleShowAuth("login")}/>} />
        <Route path="/sell/digital-notes/free" element={<FreeNotes user={user} onLogin={() => handleShowAuth("login")}/>} />
        <Route path="/sell/digital-notes/paid" element={<PaidNotes user={user} onLogin={() => handleShowAuth("login")}/>} />
        <Route path="/sell/playlists" element={<PlaylistsCategory user={user} />} />
        <Route path="/buy" element={<BuyPage/>} />
        <Route path="/buy/books" element={<BuyBooks/>} />
        <Route path="/buy/digital-notes" element={<BuyDigitalNotes/>} />
        <Route path="/buy/playlists" element={<BuyPlaylist/>} />
        <Route path="/profile" element={<UserPage/>} />
        <Route path="/sell/books/donate" element={<DonateBooks/>} />
      </Routes>
    </>
  );
}

export default AppWrapper;