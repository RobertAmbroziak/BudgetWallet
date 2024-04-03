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

function Accounts({ jwtToken }) {
  const { language } = useLanguage();
  const [accounts, setAccounts] = useState([]);
  
  const handleAccountRecordChange = (index, field, value) => {
    const updatedRecords = [...accounts];
    updatedRecords[index][field] = value;
    setAccounts(updatedRecords);
  };

  const handleDeleteAccountRecord= (index, field, value) => {
    const updatedRecords = [...accounts];
    updatedRecords[index][field] = value;
    setAccounts(updatedRecords);
  };

  const handleRestoreAccountRecord= (index, field, value) => {
    const updatedRecords = [...accounts];
    updatedRecords[index][field] = value;
    setAccounts(updatedRecords);
  };

  const handleAddAccountRecord = (index, field, value) => {
    const updatedRecords = [...accounts];
    updatedRecords[index][field] = value;
    setAccounts(updatedRecords);
  };

  const handleSaveChanges = () => {

  };

  const handleGetDefault = () => {

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
  }, [jwtToken]);

  return (
    <>
      TODO: Accounts Configuration Panel
      {/* 
        lista kont  dla usera - początkowo pusta
        checkbox 1 pokaż nieaktywne
        - każdy rekord  ma textbox na Name i description do swobodnej zmiany
        aktywne można zdezaktywować, niekatywne jesli są widoczne dzięki checkbox 1 można przywrócić
        przycisk DODAJ
        przycisk ZAPISZ
        przycisk Pobierz DEFAULT
        Zapis zwaliduje czy nowo dodany nie istnieje, również w nieaktywnych - rzuci błąd albo aktywuje nieaktywny
        jeśli name i desc jest identyczne
        
        Zapis rzuci toastr, odświeży listę kont usera 
        
        AKTYWACJA ,DEZAKTYWACJA odbywa się bez konieczności kliku w ZAPISZ - odświeży rekord
      */}
       <Button variant="outlined" onClick={handleAddAccountRecord}>
          {translations[language].btn_addAccount}
        </Button>
        <Button variant="outlined" onClick={handleSaveChanges}>
          {translations[language].btn_save}
        </Button>
        <Button variant="outlined" onClick={handleGetDefault}>
          {translations[language].btn_Default}
        </Button>
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
            }}
            noValidate
            autoComplete="off"
          >
            <IconButton
              aria-label="delete"
              onClick={() => handleDeleteAccountRecord(index)}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              aria-label="restore"
              onClick={() => handleRestoreAccountRecord(index)}
            >
              <DataSaverOn />
            </IconButton>
            
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
