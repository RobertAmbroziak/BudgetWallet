import React, { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../LanguageContext";
import translations from "../../translations";
import Stats from "./Stats";
import { MDBBtn } from "mdb-react-ui-kit";

function User({ jwtToken }) {
  const [userData, setData] = useState(null);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [isButtonGetSplitsClicked, setIsButtonGetSplitsClicked] =
    useState(false);

  const handleGetSplitsClick = () => {
    setIsButtonGetSplitsClicked(true);
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
  }, [jwtToken, navigate]);

  return (
    <div>
      {userData ? (
        <div>
          <h1>{translations[language].lbl_applicationPanel}</h1>
          <p>{userData}</p>
          <MDBBtn color="success" onClick={handleGetSplitsClick}>
            {translations[language].btn_Expenses}
          </MDBBtn>
          <MDBBtn color="danger">{translations[language].btn_Edit}</MDBBtn>
          <MDBBtn color="info">{translations[language].btn_Config}</MDBBtn>
          {isButtonGetSplitsClicked && <Stats jwtToken={jwtToken} />}
        </div>
      ) : null}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default User;
