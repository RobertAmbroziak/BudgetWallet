import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/general/header/Header';
import Footer from './components/general/footer/Footer';

import Home from './components/home/Home';
import Admin from './components/admin/Admin';
import User from './components/user/User';
import { LanguageProvider } from './LanguageContext';

function App() {
  const [jwtToken, setJwtToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const [language, setLanguage] = useState('en');
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setJwtToken(token); 
    } else {

    }
    setLoading(false);
  }, []); 

  const handleSetToken = (token) => {
    setJwtToken(token);
    localStorage.setItem('jwtToken', token);
  };

  const handleRemoveToken = () => {
    setJwtToken(null);
    localStorage.removeItem('jwtToken');
  };

  return (
    <LanguageProvider value={{ language, handleLanguageChange }}>
    <Router>
      <div>
        <Header jwtToken={jwtToken} onRemoveToken={handleRemoveToken} onSetToken={handleSetToken} />
        {!loading && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin jwtToken={jwtToken} />} />
            <Route path="/user" element={<User jwtToken={jwtToken} />} />
          </Routes>
        )}
        <Footer />
      </div>
    </Router>
    </LanguageProvider>
  );
}

export default App;
