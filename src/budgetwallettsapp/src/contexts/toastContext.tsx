import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type ToastContextType = {
  registerSuccessToast: () => void;
  setRegisterSuccessToast: Dispatch<SetStateAction<() => void>>;
};

const defaultToastContext: ToastContextType = {
  registerSuccessToast: () => {
    console.log("Default toast executed");
  },
  setRegisterSuccessToast: () => {},
};

const ToastContext = createContext<ToastContextType>(defaultToastContext);

type ToastProviderProps = {
  children: ReactNode;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [registerSuccessToast, setRegisterSuccessToast] = useState<() => void>(
    () => () => console.log("Toast!")
  );

  return (
    <ToastContext.Provider
      value={{ registerSuccessToast, setRegisterSuccessToast }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContext;
