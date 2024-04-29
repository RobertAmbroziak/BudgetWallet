import React, { useState, useContext } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";
import ToastContext from "../../contexts/toastContext";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

interface LoginProps {
  onClose: () => void;
  onSetToken: (token: any) => void;
  showRegister: boolean;
  setShowRegister: (show: boolean) => void;
  setRegisterAlerts: (alerts: JSX.Element[]) => void;
  registerAlerts: JSX.Element[];
  setLoginAlerts: (alerts: JSX.Element[]) => void;
  loginAlerts: JSX.Element[];
}

const Login: React.FC<LoginProps> = ({
  onClose,
  onSetToken,
  showRegister,
  setShowRegister,
  setRegisterAlerts,
  registerAlerts,
  setLoginAlerts,
  loginAlerts,
}) => {
  const [emailOrUserName, setEmailOrUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { registerSuccessToast } = useContext(ToastContext);

  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: any) => {
      try {
        await authenticate(tokenResponse.access_token);
        onClose();
        navigate("/user");
      } catch (error) {
        throw error;
      }
    },
  });

  const authenticate = async (token: string) => {
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.GOOGLE_LOGIN}`,
        {
          token: token,
        }
      );
      onSetToken(response.data);
      onClose();
      navigate("/user");
    } catch (error) {
      console.error(error);
      handleError(error);
    }
  };

  const standardLogin = async () => {
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.LOGIN}`,
        {
          emailOrUserName,
          password,
        }
      );
      onSetToken(response.data);
      onClose();
      navigate("/user");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMsg = error.response.data;
          setLoginAlerts([
            <div
              key="loginError"
              className="p-2 mb-2 bg-danger bg-gradient text-white rounded-5"
              style={{ fontSize: "smaller" }}
            >
              {errorMsg}
            </div>,
          ]);
        } else if (error.request) {
          const errorMsg = translations[language].err_noServerResponse;
          setLoginAlerts([
            <div
              key="loginError"
              className="p-2 mb-2 bg-danger bg-gradient text-white rounded-5"
              style={{ fontSize: "smaller" }}
            >
              {errorMsg}
            </div>,
          ]);
        } else {
          const errorMsg = translations[language].err_error + error.message;
          setLoginAlerts([
            <div
              key="loginError"
              className="p-2 mb-2 bg-danger bg-gradient text-white rounded-5"
              style={{ fontSize: "smaller" }}
            >
              {errorMsg}
            </div>,
          ]);
        }
      } else {
        console.error(error);
      }
    }
  };

  const register = async () => {
    if (password !== password) {
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
          email: emailOrUserName,
          password: password,
        }
      );
      onSetToken(response.data);
      onClose();
      setShowRegister(false);
      navigate("/");
      registerSuccessToast();
    } catch (error) {
      console.error(error);
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    setRegisterAlerts([
      <Alert severity="error" key="registerFail">
        Registration failed: {errorMessage}
      </Alert>,
    ]);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h6" gutterBottom>
        {showRegister
          ? translations[language].lbl_register
          : translations[language].lbl_signIn}
      </Typography>
      {!showRegister ? (
        <>
          <TextField
            label={translations[language].lbl_emailOrUserName}
            fullWidth
            margin="normal"
            value={emailOrUserName}
            onChange={(e) => setEmailOrUserName(e.target.value)}
          />
          <TextField
            label={translations[language].lbl_password}
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={standardLogin} variant="contained" color="primary">
            {translations[language].lbl_signIn}
          </Button>
          <div>{loginAlerts}</div>
          <div className="text-center" style={{ marginTop: "20px" }}>
            <Button onClick={handleRegisterClick}>
              {translations[language].lbl_register}
            </Button>
            <p>{translations[language].lbl_signUpWith}</p>
            <div className="d-flex justify-content-center">
              <Button
                variant="outlined"
                className="m-1 custom-google-button"
                onClick={() => googleLogin()}
              >
                Google
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <TextField
            label={translations[language].lbl_userName}
            fullWidth
            margin="normal"
            value={emailOrUserName}
            onChange={(e) => setEmailOrUserName(e.target.value)}
          />
          <TextField
            label={translations[language].lbl_email}
            type="email"
            fullWidth
            margin="normal"
            value={emailOrUserName}
            onChange={(e) => setEmailOrUserName(e.target.value)}
          />
          <TextField
            label={translations[language].lbl_password}
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={register} variant="contained" color="primary">
            {translations[language].lbl_register}
          </Button>
          <div>{registerAlerts}</div>
        </>
      )}
    </Container>
  );
};

export default Login;
