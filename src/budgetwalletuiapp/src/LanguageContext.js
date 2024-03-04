import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from './translations'

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); 

  useEffect(() => {
    const userLanguage = navigator.language.split('-')[0];
    if (userLanguage in translations) {
        setLanguage(userLanguage);
    } else {
        setLanguage('en');
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);