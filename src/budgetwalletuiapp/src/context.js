import React, { createContext, useState } from 'react';

const context = createContext();

export const MyProvider = ({ children }) => {
  const [registerSuccessToast, setRegisterSuccessToast ] = useState(() => () => {});

  return (
    <context.Provider value={
      { 
        registerSuccessToast,
        setRegisterSuccessToast
      }}>
      {children}
    </context.Provider>
  );
};

export default context;