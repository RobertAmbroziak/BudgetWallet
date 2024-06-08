import React, { useEffect } from "react";
import config from "../../config";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";
import { useSnackbar } from "../../contexts/toastContext";
import { Severity } from "../../types/enums/severity";

const ConfirmAccount: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const { language } = useLanguage();

  useEffect(() => {
    const activateAccount = async (code: string) => {
      try {
        const response = await axios.get(
          `${config.API_BASE_URL}${config.API_ENDPOINTS.ACTIVATE}/${code}`
        );
        if (response.status === 200) {
          openSnackbar(
            translations[language].toast_accountConfirmationSuccess,
            Severity.SUCCESS
          );
        } else {
          openSnackbar(
            translations[language].toast_accountConfirmationError,
            Severity.ERROR
          );
        }
        navigate("/");
      } catch (error) {
        console.error("Error activating account:", error);
        openSnackbar(
          translations[language].toast_accountConfirmationError,
          Severity.ERROR
        );
      }
    };

    if (code) {
      activateAccount(code);
    }
  }, [code, navigate]);

  return <div>{translations[language].lbl_accountConfirmationProcessing}</div>;
};

export default ConfirmAccount;
