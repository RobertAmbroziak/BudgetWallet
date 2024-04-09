import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwtToken'));

  const handleSetToken = (token) => {
    setJwtToken(token);
    localStorage.setItem('jwtToken', token);
  };

  const handleRemoveToken = () => {
    setJwtToken(null);
    localStorage.removeItem('jwtToken');
  };

  return (
    <UserContext.Provider value={{ jwtToken, handleSetToken, handleRemoveToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
