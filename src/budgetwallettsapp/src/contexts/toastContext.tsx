import React, { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import { Severity } from "../types/enums/severity";

interface SnackbarContextType {
  openSnackbar: (message: string, severity: Severity) => void;
  closeSnackbar: () => void;
}

const ToastContext = createContext<SnackbarContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<Severity>(
    Severity.SUCCESS
  );

  const openSnackbar = (message: string, severity: Severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <ToastContext.Provider value={{ openSnackbar, closeSnackbar }}>
      {children}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

export default ToastContext;
