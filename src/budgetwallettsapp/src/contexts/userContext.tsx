import { createContext, useContext, useState, ReactNode, FC } from "react";

interface UserContextType {
  jwtToken: string | null;
  handleSetToken: (token: string) => void;
  handleRemoveToken: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  const handleSetToken = (token: string) => {
    setJwtToken(token);
    localStorage.setItem("budgetWalletToken", token);
  };

  const handleRemoveToken = () => {
    setJwtToken(null);
    localStorage.removeItem("budgetWalletToken");
  };

  return (
    <UserContext.Provider
      value={{ jwtToken, handleSetToken, handleRemoveToken }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
