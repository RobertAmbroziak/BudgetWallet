import { useState, FC } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import Home from "./pages/home/home";
import Admin from "./pages/admin/admin";
import User from "./pages/application/application";
import { LanguageProvider } from "./contexts/languageContext";
//import { ToastProvider } from "./contexts/toastContext";
import { UserProvider } from "./contexts/userContext";

const App: FC = () => {
  const [language, setLanguage] = useState<string>("en");

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <UserProvider>
      {/* <ToastProvider> */}
      <LanguageProvider value={{ language, handleLanguageChange }}>
        <Router>
          <div>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/user" element={<User />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </LanguageProvider>
      {/* </ToastProvider> */}
    </UserProvider>
  );
};

export default App;
