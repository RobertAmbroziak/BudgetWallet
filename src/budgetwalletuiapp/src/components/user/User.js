import React, { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../LanguageContext";
import translations from "../../translations";
import Stats from "./Stats";
import AddExpense from "./AddExpense";
import AccountsState from "./AccountsState";
import Configuration from "./Configuration";
import { MDBBtn } from "mdb-react-ui-kit";
import { CategoriesProvider } from "./CategoriesContext";
import { useUser } from "../../UserContext";

function User() {
  const { jwtToken } = useUser();
  const [userData, setData] = useState(null);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isButtonGetSplitsClicked, setIsButtonGetSplitsClicked] =
    useState(false);
  const [isButtonAddExpenseClicked, setIsButtonAdExpenseClicked] =
    useState(false);
  const [isButtonConfigurationClicked, setIsButtonConfigurationClicked] =
    useState(false);
  const [isButtonAccountsStateClicked, setIsButtonAccountsStateClicked] =
    useState(false);

  const handleGetSplitsClick = () => {
    setIsButtonGetSplitsClicked(true);
    setIsButtonAdExpenseClicked(false);
    setIsButtonConfigurationClicked(false);
    setIsButtonAccountsStateClicked(false);
  };

  const handleAddExpenseClick = () => {
    setIsButtonGetSplitsClicked(false);
    setIsButtonAdExpenseClicked(true);
    setIsButtonConfigurationClicked(false);
    setIsButtonAccountsStateClicked(false);
  };

  const handleConfigurationClick = () => {
    setIsButtonGetSplitsClicked(false);
    setIsButtonAdExpenseClicked(false);
    setIsButtonConfigurationClicked(true);
    setIsButtonAccountsStateClicked(false);
  };

  const handleAccountsStateClick = () => {
    setIsButtonGetSplitsClicked(false);
    setIsButtonAdExpenseClicked(false);
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
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
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
    <CategoriesProvider>
      <div>
        {userData ? (
          <div>
            <h1>{translations[language].lbl_applicationPanel}</h1>
            <p>{userData}</p>
            <MDBBtn
              className="me-1"
              color="success"
              onClick={handleGetSplitsClick}
            >
              {translations[language].btn_Expenses}
            </MDBBtn>
            <MDBBtn
              className="me-1"
              color="danger"
              onClick={handleAddExpenseClick}
            >
              {translations[language].btn_Edit}
            </MDBBtn>
            <MDBBtn
              className="me-1"
              color="info"
              onClick={handleConfigurationClick}
            >
              {translations[language].btn_Config}
            </MDBBtn>
            <MDBBtn color="warning" onClick={handleAccountsStateClick}>
              {translations[language].btn_AccountsState}
            </MDBBtn>
            {isButtonGetSplitsClicked && <Stats />}
            {isButtonAddExpenseClicked && <AddExpense />}
            {isButtonConfigurationClicked && <Configuration />}
            {isButtonAccountsStateClicked && <AccountsState />}
          </div>
        ) : null}
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </CategoriesProvider>
  );
}

export default User;
