import React, {useState, useEffect, useContext} from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ToastContext from '../../ToastContext';
import { useLanguage } from '../../LanguageContext';
import translations from '../../translations';

function Home() {
  const [count, setCount] = useState(0);
  const { setRegisterSuccessToast } = useContext(ToastContext);
  const { language } = useLanguage();
 
  const registerSuccessToast = () => {
    toast.success(translations[language].toast_registerSuccess, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      //transition: Bounce,
      });
  };

  useEffect(() => {
    setRegisterSuccessToast(() => registerSuccessToast);
  }, []);

  return (
    <div>
      <ToastContainer/>
      <h1>Strona Główna  - {count}</h1>
	  <p>strona ogólnie dostępna. Na ten moment zostawiam tu najbardziej epicką i efektowną funkcjonalność REACT. Można klikać do woli</p>
      <button onClick={() => setCount(count + 1)}>Magiczny Przycisk</button>
    </div>
  );
}

export default Home;