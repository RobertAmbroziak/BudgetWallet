import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from "react";
import translations from "./../translations";

interface LanguageContextType {
  language: string;
  handleLanguageChange: (lang: string) => void;
}

const defaultLanguageContext: LanguageContextType = {
  language: "en",
  handleLanguageChange: () => {},
};

const LanguageContext = createContext<LanguageContextType>(
  defaultLanguageContext
);

interface LanguageProviderProps {
  children: ReactNode;
  value: {
    language: string;
    handleLanguageChange: (lang: string) => void;
  };
}

export const LanguageProvider: FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>("en");

  useEffect(() => {
    const userLanguage = navigator.language.split("-")[0];
    if (userLanguage in translations) {
      setLanguage(userLanguage);
    } else {
      setLanguage("en");
    }
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, handleLanguageChange }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
