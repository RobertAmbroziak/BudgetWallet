import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import { useLanguage } from "../../contexts/languageContext";
import { useSnackbar } from "../../contexts/toastContext";
import translations from "../../translations";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { Severity } from "../../types/enums/severity";

interface RegisterProps {
  setShowRegister: (show: boolean) => void;
  setRegisterAlerts: (alerts: JSX.Element[]) => void;
  registerAlerts: JSX.Element[];
}

const Register: React.FC<RegisterProps> = ({
  setShowRegister,
  setRegisterAlerts,
  registerAlerts,
}) => {
  const [registerUserName, setRegisterUserName] = useState<string>("");
  const [registerEmail, setRegisterEmail] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  const [registerRepeatPassword, setRegisterRepeatPassword] =
    useState<string>("");
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [alerts, setAlerts] = useState<JSX.Element[]>([]);

  const register = async () => {
    if (registerPassword !== registerRepeatPassword) {
      const passwordMismatchError = translations[language].err_passwordMismatch;
      setRegisterAlerts([
        <Alert severity="error" key="passwordMismatch">
          {passwordMismatchError}
        </Alert>,
      ]);
      return;
    }
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.REGISTER}`,
        {
          userName: registerUserName,
          email: registerEmail,
          password: registerPassword,
        }
      );
      setShowRegister(false);
      navigate("/");
      openSnackbar(
        translations[language].toast_registerSuccess,
        Severity.SUCCESS
      );
    } catch (error) {
      handleError(error);
      setRegisterAlerts(alerts);
    }
  };

  const handleError = (error: any) => {
    let alerts: JSX.Element[] = [];

    if (error.response) {
      const errors: string | string[] = error.response.data;
      let errorMessage: string;
      if (Array.isArray(errors)) {
        errorMessage = errors.join(" ");
      } else {
        errorMessage = errors;
      }
      alerts.push(
        <Alert severity="error" key="errorList">
          {errorMessage}
        </Alert>
      );
    } else if (error.request) {
      const errors = translations[language].err_noServerResponse;
      alerts.push(
        <Alert severity="error" key="noServerResponse">
          {errors}
        </Alert>
      );
    } else {
      const errors = translations[language].err_error + error.message;
      alerts.push(
        <Alert severity="error" key="otherError">
          {errors}
        </Alert>
      );
    }
    setAlerts(alerts);
  };

  return (
    <>
      <TextField
        label={translations[language].lbl_userName}
        fullWidth
        margin="normal"
        value={registerUserName}
        onChange={(e) => setRegisterUserName(e.target.value)}
      />
      <TextField
        label={translations[language].lbl_email}
        type="email"
        fullWidth
        margin="normal"
        value={registerEmail}
        onChange={(e) => setRegisterEmail(e.target.value)}
      />
      <TextField
        label={translations[language].lbl_password}
        type="password"
        fullWidth
        margin="normal"
        value={registerPassword}
        onChange={(e) => setRegisterPassword(e.target.value)}
      />
      <TextField
        label={translations[language].lbl_repeatPassword}
        type="password"
        fullWidth
        margin="normal"
        value={registerRepeatPassword}
        onChange={(e) => setRegisterRepeatPassword(e.target.value)}
      />
      <Button onClick={register} variant="contained" color="primary">
        {translations[language].lbl_register}
      </Button>
      <div>{registerAlerts}</div>
    </>
  );
};

export default Register;
