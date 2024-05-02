import React, { useState, useEffect, FC } from "react";
import config from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";
//import Stats from "./Stats";
//import AddExpense from "./AddExpense";
//import AccountsState from "./AccountsState";
//import Configuration from "./Configuration";
import Button from "@mui/material/Button";
//import { CategoriesProvider } from "./CategoriesContext";
import { useUser } from "../../contexts/userContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Application: FC = () => {
  const { jwtToken } = useUser();
  const [userData, setData] = useState<any>(null);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isButtonGetSplitsClicked, setIsButtonGetSplitsClicked] =
    useState(false);
  const [isButtonAddExpenseClicked, setIsButtonAddExpenseClicked] =
    useState(false);
  const [isButtonConfigurationClicked, setIsButtonConfigurationClicked] =
    useState(false);
  const [isButtonAccountsStateClicked, setIsButtonAccountsStateClicked] =
    useState(false);

  const handleGetSplitsClick = () => {
    setIsButtonGetSplitsClicked(true);
    setIsButtonAddExpenseClicked(false);
    setIsButtonConfigurationClicked(false);
    setIsButtonAccountsStateClicked(false);
  };

  const handleAddExpenseClick = () => {
    setIsButtonGetSplitsClicked(false);
    setIsButtonAddExpenseClicked(true);
    setIsButtonConfigurationClicked(false);
    setIsButtonAccountsStateClicked(false);
  };

  const handleConfigurationClick = () => {
    setIsButtonGetSplitsClicked(false);
    setIsButtonAddExpenseClicked(false);
    setIsButtonConfigurationClicked(true);
    setIsButtonAccountsStateClicked(false);
  };

  const handleAccountsStateClick = () => {
    setIsButtonGetSplitsClicked(false);
    setIsButtonAddExpenseClicked(false);
    setIsButtonConfigurationClicked(false);
    setIsButtonAccountsStateClicked(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (jwtToken) {
          const response = await axios.get(
            `${config.API_BASE_URL}${config.API_ENDPOINTS.APPLICATION}`,
            {
              headers: { Authorization: `Bearer ${jwtToken}` },
            }
          );
          setData(response.data);
        } else {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
      }
    };
    fetchData();
  }, [navigate, jwtToken]);

  return (
    // <CategoriesProvider>
    <div className="application-container">
      {userData ? (
        <div>
          <Typography variant="h6" sx={{ marginLeft: 2, marginTop: 1 }}>
            {translations[language].lbl_applicationPanel}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={handleGetSplitsClick}
              sx={{ margin: 1 }}
            >
              {translations[language].btn_Expenses}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleAddExpenseClick}
              sx={{ margin: 1 }}
            >
              {translations[language].btn_Edit}
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={handleConfigurationClick}
              sx={{ margin: 1 }}
            >
              {translations[language].btn_Config}
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleAccountsStateClick}
              sx={{ margin: 1 }}
            >
              {translations[language].btn_AccountsState}
            </Button>
          </Box>
          {/* {isButtonGetSplitsClicked && <Stats />}
            {isButtonAddExpenseClicked && <AddExpense />}
            {isButtonConfigurationClicked && <Configuration />}
            {isButtonAccountsStateClicked && <AccountsState />} */}
        </div>
      ) : null}
    </div>
    // </CategoriesProvider>
  );
};

export default Application;
