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
import EditIcon from "@mui/icons-material/Edit";
import { DataSaverOn } from "@mui/icons-material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import BudgetDetails from "./BudgetDetails";

function Budgets({ jwtToken, onSuccess, onError }) {
  const { language } = useLanguage();
  const [budgets, setBudgets] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);

  const handleBudgetRecordChange = (index, field, value) => {
    const updatedRecords = [...budgets];
    updatedRecords[index][field] = value;
    setBudgets(updatedRecords);
  };

  const handleEditBudgetRecord = (budgetId) => {
    setSelectedBudgetId(budgetId);
  };

  const handleAddBudgetRecord = () => {
    const exists = budgets.some((budget) => budget.id === 0);

    if (!exists) {
      const currentDate = new Date();
      const validFrom = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const validTo = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      );

      const description = `${validFrom.getFullYear()}-${String(
        validFrom.getMonth() + 1
      ).padStart(2, "0")}`;

      let baseName = description;
      let name = baseName;
      let version = 2;

      while (budgets.some((budget) => budget.name === name)) {
        name = `${baseName}v${version}`;
        version++;
      }

      const formatYYYYMMDD = (date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`;

      setBudgets([
        ...budgets,
        {
          id: 0,
          name: name,
          description: description,
          validFrom: validFrom,
          validTo: validTo,
          isActive: true,
        },
      ]);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.TODOBudgets}`,
        budgets,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      onSuccess(translations[language].toast_updateBudgetsSuccess);
    } catch (error) {
      onError(translations[language].toast_updateBudgetsError);
    }
  };

  const handleGetDefault = async () => {
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.TODOBUDGETS}/default`,
        budgets,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      const updatedBudgets = [...budgets, ...response.data];
      setBudgets(updatedBudgets);
    } catch (error) {
      console.error("Error fetching default budgets:", error);
    }
  };

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get(
          `${config.API_BASE_URL}${config.API_ENDPOINTS.BUDGETS}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setBudgets(response.data.budgets);
      } catch (error) {
        console.error("Error fetching budgets", error);
      }
    };
    fetchBudgets();
  }, [jwtToken, onSuccess]);

  if (selectedBudgetId !== null) {
    return <BudgetDetails jwtToken={jwtToken} budgetId={selectedBudgetId} onBack={() => setSelectedBudgetId(null)} />;
  }

  return (
    <>
      <Button variant="outlined" onClick={handleAddBudgetRecord}>
        {translations[language].btn_addBudget}
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
      {budgets.map((record, index) => (
        <Box
          key={"key_budgetBox_" + index}
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
          <IconButton
            aria-label="edit"
            onClick={() => handleEditBudgetRecord(record.id)}
          >
            <EditIcon />
          </IconButton>

          <TextField
            id={"budgetName_" + index}
            variant="outlined"
            label={translations[language].txt_name}
            value={record.name}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            id={"budgetDescription_" + index}
            variant="outlined"
            label={translations[language].txt_description}
            value={record.description}
            InputProps={{
              readOnly: true,
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TextField
              id={"budgetValidFrom_" + index}
              variant="outlined"
              label={translations[language].lbl_budgetValidFromDate}
              value={dayjs(record.validFrom).format("YYYY-MM-DD")}
              InputProps={{
                readOnly: true,
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TextField
              id={"budgetValidTo_" + index}
              variant="outlined"
              label={translations[language].lbl_budgetValidToDate}
              value={dayjs(record.validTo).format("YYYY-MM-DD")}
              InputProps={{
                readOnly: true,
              }}
            />
          </LocalizationProvider>
        </Box>
      ))}
    </>
  );
}

export default Budgets;
