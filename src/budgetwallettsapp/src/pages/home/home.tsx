import React, { useState, useEffect, useContext } from "react";
import { Snackbar, Button } from "@mui/material";
import ToastContext from "../../contexts/toastContext";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";

function Home() {
  const [count, setCount] = useState<number>(0);
  const toastContext = useContext(ToastContext);
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const registerSuccessToast = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (toastContext) {
      toastContext.setRegisterSuccessToast(() => registerSuccessToast);
    }
  }, [toastContext, registerSuccessToast]);

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        message={translations[language].toast_registerSuccess}
        action={
          <Button color="secondary" size="small" onClick={handleClose}>
            {translations[language].btn_close}
          </Button>
        }
      />
      <h1>Strona Główna - {count}</h1>
      <p>
        strona ogólnie dostępna. Na ten moment zostawiam tu najbardziej epicką i
        efektowną funkcjonalność REACT. Można klikać do woli
      </p>
      <button onClick={() => setCount(count + 1)}>Magiczny Przycisk</button>
    </div>
  );
}

export default Home;
