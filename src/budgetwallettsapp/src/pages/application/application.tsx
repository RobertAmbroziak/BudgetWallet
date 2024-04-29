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
    <div>
      {userData ? (
        <div>
          <h1>{translations[language].lbl_applicationPanel}</h1>
          <p>{userData}</p>
          <Button
            variant="contained"
            color="success"
            onClick={handleGetSplitsClick}
          >
            {translations[language].btn_Expenses}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleAddExpenseClick}
          >
            {translations[language].btn_Edit}
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={handleConfigurationClick}
          >
            {translations[language].btn_Config}
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleAccountsStateClick}
          >
            {translations[language].btn_AccountsState}
          </Button>
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
