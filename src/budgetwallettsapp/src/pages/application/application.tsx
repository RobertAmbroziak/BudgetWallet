import { useState, useEffect, FC } from "react";
import config from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";
import Expenses from "../../components/expenses/expenses";
import Accounts from "../../components/account/account";
import Configuration from "../../components/configuration/configuration";
import Button from "@mui/material/Button";
import { CategoryProvider } from "../../contexts/categoryContext";
import { useUser } from "../../contexts/userContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddExpense from "../../components/expense/addExpense";

const Application: FC = () => {
  const { jwtToken } = useUser();
  const [userData, setData] = useState<any>(null);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isButtonExpensesClicked, setIsButtonExpensesClicked] =
    useState<boolean>(false);
  const [isButtonExpenseClicked, setIsButtonExpenseClicked] =
    useState<boolean>(false);
  const [isButtonConfigurationClicked, setIsButtonConfigurationClicked] =
    useState<boolean>(false);
  const [isButtonAccountClicked, setIsButtonAccountClicked] =
    useState<boolean>(false);

  const handleExpensesClick = () => {
    setIsButtonExpensesClicked(true);
    setIsButtonExpenseClicked(false);
    setIsButtonConfigurationClicked(false);
    setIsButtonAccountClicked(false);
  };

  const handleExpenseClick = () => {
    setIsButtonExpensesClicked(false);
    setIsButtonExpenseClicked(true);
    setIsButtonConfigurationClicked(false);
    setIsButtonAccountClicked(false);
  };

  const handleConfigurationClick = () => {
    setIsButtonExpensesClicked(false);
    setIsButtonExpenseClicked(false);
    setIsButtonConfigurationClicked(true);
    setIsButtonAccountClicked(false);
  };

  const handleAccountClick = () => {
    setIsButtonExpensesClicked(false);
    setIsButtonExpenseClicked(false);
    setIsButtonConfigurationClicked(false);
    setIsButtonAccountClicked(true);
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
    <CategoryProvider>
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
                onClick={handleExpensesClick}
                sx={{ margin: 1 }}
              >
                {translations[language].btn_Expenses}
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleExpenseClick}
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
                onClick={handleAccountClick}
                sx={{ margin: 1 }}
              >
                {translations[language].btn_AccountsState}
              </Button>
            </Box>
            {isButtonExpensesClicked && <Expenses />}
            {isButtonExpenseClicked && <AddExpense />}
            {isButtonConfigurationClicked && <Configuration />}
            {isButtonAccountClicked && <Accounts />}
          </div>
        ) : null}
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </CategoryProvider>
  );
};

export default Application;
