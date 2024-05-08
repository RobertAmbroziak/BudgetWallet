import React, { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import BudgetDetail from "./budgetDetail";
import { Budget } from "../../types/api/budget";
import { useUser } from "../../contexts/userContext";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

function BudgetConfiguration() {
  const { jwtToken } = useUser();
  const { language } = useLanguage();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showInactive, setShowInactive] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [reload, setReload] = useState(false);

  const handleEditBudgetRecord = (budget: Budget) => {
    setSelectedBudget(budget);
  };

  const handleAddBudgetRecord = () => {
    const exists = budgets.some((budget) => budget.id === 0);

    if (!exists) {
      const currentDate = dayjs().utc().startOf("day").toDate();
      const validFrom = new Date(
        Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 1)
      );
      const validTo = new Date(
        Date.UTC(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      );
      const description = `${validFrom.getFullYear()}-${String(
        validFrom.getMonth() + 1
      ).padStart(2, "0")}`;

      let baseName = description;
      let budgetName = baseName;
      let version = 2;

      while (budgets.some((budget) => budget.name === budgetName)) {
        budgetName = `${baseName}v${version}`;
        version++;
      }

      setBudgets([
        ...budgets,
        {
          id: 0,
          name: budgetName,
          description: description,
          validFrom: validFrom,
          validTo: validTo,
          isActive: true,
        },
      ]);
    }
  };

  const handleGetDefault = async () => {
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.BUDGETS}/default`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      const updatedBudgets = [...budgets, response.data];
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
  }, [jwtToken, onSuccess, onError, reload]);

  if (selectedBudget !== null) {
    return (
      <BudgetDetails
        simpleBudget={selectedBudget}
        onBack={() => {
          setSelectedBudget(null);
          setReload((reload) => !reload);
        }}
        onSuccess={onSuccess}
        onError={onError}
      />
    );
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
            onClick={() => handleEditBudgetRecord(record)}
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
              value={
                record.validTo
                  ? dayjs
                      .utc(record.validFrom)
                      .startOf("day")
                      .format("YYYY-MM-DD")
                  : ""
              }
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
              value={
                record.validTo
                  ? dayjs
                      .utc(record.validTo)
                      .startOf("day")
                      .format("YYYY-MM-DD")
                  : ""
              }
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

export default BudgetConfiguration;
