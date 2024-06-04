import { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataSaverOn } from "@mui/icons-material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useUser } from "../../contexts/userContext";
import { Account } from "../../types/api/account";
import { useSnackbar } from "../../contexts/toastContext";
import { Severity } from "../../types/enums/severity";

function AccountConfiguration() {
  const { jwtToken } = useUser();
  const { language } = useLanguage();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showInactive, setShowInactive] = useState<boolean>(false);
  const { openSnackbar } = useSnackbar();

  const handleAccountRecordChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const updatedRecords = [...accounts];
    if (field === "name" || field === "description") {
      updatedRecords[index][field] = value as string;
    } else if (field === "minValue") {
      updatedRecords[index][field] = value as number;
    } else if (field === "isActive") {
      updatedRecords[index][field] = value as boolean;
    }
    setAccounts(updatedRecords);
  };

  const handleDeleteAccountRecord = (index: number) => {
    const updatedRecords = [...accounts];
    if (updatedRecords[index].id > 0) {
      updatedRecords[index].isActive = false;
    } else {
      updatedRecords.splice(index, 1);
    }
    setAccounts(updatedRecords);
  };

  const handleRestoreAccountRecord = (index: number) => {
    const updatedRecords = [...accounts];
    if (updatedRecords[index].id > 0) {
      updatedRecords[index].isActive = true;
    } else {
      updatedRecords.splice(index, 1);
    }
    setAccounts(updatedRecords);
  };

  const handleAddAccountRecord = () => {
    setAccounts([
      ...accounts,
      { id: 0, name: "", description: "", minValue: 0, isActive: true },
    ]);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.ACCOUNTS}`,
        accounts,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      fetchAccounts();
      openSnackbar(
        translations[language].toast_updateAccountsSuccess,
        Severity.SUCCESS
      );
    } catch (error) {
      openSnackbar(
        translations[language].toast_updateAccountsError,
        Severity.ERROR
      );
    }
  };

  const handleGetDefault = async () => {
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.ACCOUNTS}/default`,
        accounts,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      const updatedAccounts = [...accounts, ...response.data];
      setAccounts(updatedAccounts);
    } catch (error) {
      console.error("Error fetching default accounts:", error);
    }
  };

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

  useEffect(() => {
    fetchAccounts();
  }, [jwtToken]);

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
              onClick={() => handleRestoreAccountRecord(index)}
            >
              <DataSaverOn />
            </IconButton>
          )}

          <TextField
            id={"accountName_" + index}
            variant="outlined"
            label={translations[language].txt_name}
            value={record.name}
            onChange={(e) =>
              handleAccountRecordChange(index, "name", e.target.value)
            }
          />
          <TextField
            id={"accountDescription" + index}
            variant="outlined"
            label={translations[language].txt_description}
            value={record.description}
            onChange={(e) =>
              handleAccountRecordChange(index, "description", e.target.value)
            }
          />
          <TextField
            id={"accountMinValue" + index}
            variant="outlined"
            label={translations[language].txt_minValue}
            value={record.minValue}
            onChange={(e) =>
              handleAccountRecordChange(index, "minValue", e.target.value)
            }
          />
        </Box>
      ))}
    </>
  );
}

export default AccountConfiguration;
