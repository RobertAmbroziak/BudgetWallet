import { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";
import { useUser } from "../../contexts/userContext";

function Admin() {
  const { jwtToken } = useUser();
  const [adminData, setAdminData] = useState<string | null>(null);
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (jwtToken) {
          const response = await axios.get<string>(
            `${config.API_BASE_URL}${config.API_ENDPOINTS.ADMIN}`,
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );
          setAdminData(response.data);
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
