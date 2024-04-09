import React, { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../LanguageContext";
import translations from "../../translations";
import Stats from "./Stats";
import AddExpense from "./AddExpense";
import Configuration from "./Configuration";
import { MDBBtn } from "mdb-react-ui-kit";
import { CategoriesProvider } from './CategoriesContext'; 
import { useUser } from '../../UserContext';

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

  const handleGetSplitsClick = () => {
    setIsButtonGetSplitsClicked(true);
    setIsButtonAdExpenseClicked(false);
    setIsButtonConfigurationClicked(false);
  };

  const handleAddExpenseClick = () => {
    setIsButtonGetSplitsClicked(false);
    setIsButtonAdExpenseClicked(true);
    setIsButtonConfigurationClicked(false);
  };

  const handleConfigurationClick = () => {
    setIsButtonGetSplitsClicked(false);
    setIsButtonAdExpenseClicked(false);
    setIsButtonConfigurationClicked(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (jwtToken) {
          const response = await axios.get(
            `${config.API_BASE_URL}${config.API_ENDPOINTS.USER}`,
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
  }, [navigate]);

  return (
    <CategoriesProvider>
    <div>
      {userData ? (
        <div>
          <h1>{translations[language].lbl_applicationPanel}</h1>
          <p>{userData}</p>
          <MDBBtn color="success" onClick={handleGetSplitsClick}>
            {translations[language].btn_Expenses}
          </MDBBtn>
          <MDBBtn color="danger" onClick={handleAddExpenseClick}>
            {translations[language].btn_Edit}
          </MDBBtn>
          <MDBBtn color="info"onClick={handleConfigurationClick}>
            {translations[language].btn_Config}
          </MDBBtn>
          {isButtonGetSplitsClicked && <Stats />}
          {isButtonAddExpenseClicked && <AddExpense  />}
          {isButtonConfigurationClicked && <Configuration />}
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
