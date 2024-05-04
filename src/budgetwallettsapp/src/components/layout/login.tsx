import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { IconButton } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Register from "./register";

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
  const [alerts, setAlerts] = useState<JSX.Element[]>([]);

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
      handleError(error);
      setLoginAlerts(alerts);
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
    <Container maxWidth="sm">
      <div>
        <Typography variant="h6" gutterBottom>
          {showRegister
            ? translations[language].lbl_registerModule
            : translations[language].lbl_signInModule}
        </Typography>
      </div>
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
            <Typography
              variant="body1"
              style={{
                whiteSpace: "nowrap",
              }}
            >
              {translations[language].lbl_notMember}
              <Button
                onClick={handleRegisterClick}
                variant="contained"
                color="primary"
                style={{ display: "block", margin: "auto" }}
              >
                {translations[language].lbl_register}
              </Button>
            </Typography>
            <Typography variant="body1">
              {translations[language].lbl_signUpWith}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <IconButton onClick={() => googleLogin()} className="m-1">
                <GoogleIcon />
              </IconButton>
            </Box>
          </div>
        </>
      ) : (
        <Register
          setShowRegister={setShowRegister}
          setRegisterAlerts={setRegisterAlerts}
          registerAlerts={registerAlerts}
        />
      )}
    </Container>
  );
};

export default Login;
