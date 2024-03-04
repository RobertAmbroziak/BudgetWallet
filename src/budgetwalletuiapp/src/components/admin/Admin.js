import React, { useState, useEffect } from 'react';
import config from '../../config';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { useLanguage } from '../../LanguageContext';
import translations from '../../translations';

function Admin({ jwtToken }) {
  const [adminData, setData] = useState(null);
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (jwtToken) {
          const response = await axios.get(`${config.API_BASE_URL}${config.API_ENDPOINTS.ADMIN}`, {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }  
          );
          setData(response.data);
        }
        else
        {
            navigate('/')
        };
      } catch (error) {
          navigate('/')
      }
    };
    fetchData();
  },[jwtToken, navigate]);

  return (
    <div>
      {adminData ? (
        <div>
          <h1>{translations[language].lbl_adminPanel}</h1>
          <p>{adminData}</p>
        </div>
      ) : null}
    </div>
  );
}

export default Admin;