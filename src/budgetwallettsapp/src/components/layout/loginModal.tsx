import React, { useState, FC } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";
import CloseIcon from "@mui/icons-material/Close";
import Login from "./login";

interface LoginModalProps {
  isOpen: boolean;
  handleClose: () => void;
  onSetToken: (token: any) => void;
}

const LoginModal: FC<LoginModalProps> = ({
  isOpen,
  handleClose,
  onSetToken,
}) => {
  const { language } = useLanguage();
  const [showRegister, setShowRegister] = useState(false);
  const [registerAlerts, setRegisterAlerts] = useState<JSX.Element[]>([]);
  const [loginAlerts, setLoginAlerts] = useState<JSX.Element[]>([]);

  const handleSetToken = (token: any) => {
    onSetToken(token);
  };

  const toggleOpen = () => {
    setShowRegister(false);
    clearRegisterAndLoginAlerts();
    handleClose();
  };

  const clearRegisterAndLoginAlerts = () => {
    setRegisterAlerts([]);
    setLoginAlerts([]);
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      <Box sx={style}>
        <Typography id="login-modal-title" variant="h6" component="h2">
          {translations[language].lbl_userAccount}
          <Button
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
            }}
          >
            <CloseIcon />
          </Button>
        </Typography>
        <Box mt={2}>
          <Login
            onClose={handleClose}
            onSetToken={handleSetToken}
            showRegister={showRegister}
            setShowRegister={setShowRegister}
            setRegisterAlerts={setRegisterAlerts}
            registerAlerts={registerAlerts}
            setLoginAlerts={setLoginAlerts}
            loginAlerts={loginAlerts}
          />
        </Box>
        <Box mt={2}>
          <Button onClick={toggleOpen} color="primary">
            {translations[language].btn_close}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LoginModal;
