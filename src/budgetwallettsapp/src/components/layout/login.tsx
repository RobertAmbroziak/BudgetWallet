import React, { useState, useRef } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";
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
import FacebookIcon from "@mui/icons-material/Facebook";
import Register from "./register";
import "./login.css";

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
  const facebookButtonRef = useRef<HTMLDivElement | null>(null);

  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: any) => {
      try {
        await authenticateGoogle(tokenResponse.access_token);
        onClose();
        navigate("/user");
      } catch (error) {
        throw error;
      }
    },
  });

  const handleFacebookCallback = async (response: any) => {
    if (response?.status === "unknown") {
      console.error(
        "Przepraszamy!",
        "Coś poszło nie tak z logowaniem przez Facebook."
      );
      return;
    }
    try {
      await authenticateFacebook(response.accessToken);
      onClose();
      navigate("/user");
    } catch (error) {
      const errorAlerts = handleError(error);
      setLoginAlerts(errorAlerts);
    }
  };

  const facebookLogin = () => {
    if (facebookButtonRef.current) {
      const button = facebookButtonRef.current.querySelector("button");
      if (button) {
        button.click();
      }
    }
  };

  const authenticateGoogle = async (token: string) => {
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

  const authenticateFacebook = async (token: string) => {
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.FACEBOOK_LOGIN}`,
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
      const errorAlerts = handleError(error);
      setLoginAlerts(errorAlerts);
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
    return alerts;
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
              <IconButton onClick={() => facebookLogin()} className="m-1">
                <FacebookIcon />
              </IconButton>
            </Box>
            <div ref={facebookButtonRef} style={{ display: "none" }}>
              <FacebookLogin
                appId={config.FACEBOOK_CLIENT_ID}
                autoLoad={false}
                fields="name,email,picture"
                callback={handleFacebookCallback}
              />
            </div>
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
