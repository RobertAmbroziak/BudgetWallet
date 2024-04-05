import React, { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import { useLanguage } from "../../LanguageContext";
import translations from "../../translations";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataSaverOn } from "@mui/icons-material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

function Accounts({ jwtToken, onSuccess, onError }) {
  const { language } = useLanguage();
  const [accounts, setAccounts] = useState([]);
  const [showInactive, setShowInactive] = useState(false);

  const handleAccountRecordChange = (index, field, value) => {
    const updatedRecords = [...accounts];
    updatedRecords[index][field] = value;
    setAccounts(updatedRecords);
  };

  const handleDeleteAccountRecord = (index) => {
    const updatedRecords = [...accounts];
    if (updatedRecords[index].id > 0) {
      updatedRecords[index].isActive = false;
      setAccounts(updatedRecords);
    } else {
      updatedRecords.splice(index, 1);
      setAccounts(updatedRecords);
    }
  };

  const handleRestoreAccountRecord = (index, field, value) => {
    const updatedRecords = [...accounts];
    updatedRecords[index][field] = value;
    setAccounts(updatedRecords);
  };

  const handleAddAccountRecord = () => {
    setAccounts([
      ...accounts,
      { id: "", name: "", description: "", minValue: 0, isActive: true },
    ]);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.ACCOUNTS}`,
        accounts,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      onSuccess(translations[language].toast_updateAccountsSuccess);

    } catch (error) {
      onError(translations[language].toast_updateAccountsError);
    }
  };

  const handleGetDefault = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.ACCOUNTS}/default`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          data: accounts,
        }
      );
      const updatedAccounts = [...accounts, ...response.data];
      setAccounts(updatedAccounts);
    } catch (error) {
      console.error("Error fetching default accounts:", error);
    }
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(
          `${config.API_BASE_URL}${config.API_ENDPOINTS.ACCOUNTS}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setAccounts(response.data);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchAccounts();
  }, [jwtToken, onSuccess]);

  return (
    <>
      <Button variant="outlined" onClick={handleAddAccountRecord}>
        {translations[language].btn_addAccount}
      </Button>
      <Button variant="outlined" onClick={handleSaveChanges}>
        {translations[language].btn_save}
      </Button>
      <Button variant="outlined" onClick={handleGetDefault}>
        {translations[language].btn_Default}
      </Button>
      <FormControlLabel
        control={
          <Checkbox
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
          />
        }
        label={translations[language].cbx_ShowInactive}
      />
      {accounts.map((record, index) => (
        <Box
          key={"key_accountBox_" + index}
          sx={{
            display: "flex",
            flexDirection: "row",
            "& > :not(style)": { m: 1, width: "auto" },
            "@media (max-width:600px)": {
              flexDirection: "column",
            },
            visibility:
              !record.isActive && !showInactive ? "hidden" : "visible",
            position:
              !record.isActive && !showInactive ? "absolute" : "relative",
            height: !record.isActive && !showInactive ? 0 : "auto",
            overflow: !record.isActive && !showInactive ? "hidden" : "visible",
          }}
          noValidate
          autoComplete="off"
        >
          {record.isActive ? (
            <IconButton
              aria-label="delete"
              onClick={() => handleDeleteAccountRecord(index)}
            >
              <DeleteIcon />
            </IconButton>
          ) : (
            <IconButton
              aria-label="restore"
              onClick={() =>
                handleRestoreAccountRecord(index, "isActive", true)
              }
            >
              <DataSaverOn />
            </IconButton>
          )}

          <TextField
            id={"accountName_" + index}
            variant="outlined"
            label={translations[language].txt_name}
            value={accounts[index].name}
            onChange={(e) =>
              handleAccountRecordChange(index, "name", e.target.value)
            }
          />
          <TextField
            id={"accountDescription" + index}
            variant="outlined"
            label={translations[language].txt_description}
            value={accounts[index].description}
            onChange={(e) =>
              handleAccountRecordChange(index, "description", e.target.value)
            }
          />
          <TextField
            id={"accountMinValue" + index}
            variant="outlined"
            label={translations[language].txt_minValue}
            value={accounts[index].minValue}
            onChange={(e) =>
              handleAccountRecordChange(index, "minValue", e.target.value)
            }
          />
        </Box>
      ))}
    </>
  );
}

export default Accounts;
