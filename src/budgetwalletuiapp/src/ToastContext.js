import React, { createContext, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [registerSuccessToast, setRegisterSuccessToast ] = useState(() => () => {});

  return (
    <ToastContext.Provider value={
      { 
        registerSuccessToast,
        setRegisterSuccessToast
      }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContext;