import React, { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import dayjs from "dayjs";

function AddExpense({ jwtToken }) {
  const [budgets, setBudgets] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transferDate, setTransferDate] = useState(dayjs());
  const [categories, setCategories] = useState([]);
  const [budgetId, setBudgetId] = useState();
  const [accountId, setAccountId] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [splitRecords, setSplitRecords] = useState([
    {},
  ]);

  const handleAddSplitRecord = () => {
    setSplitRecords([
      ...splitRecords,
      {},
    ]);
  };

  const handleDeleteSplitRecord = (index) => {
    if (splitRecords.length > 1) {
      const updatedRecords = [...splitRecords];
      updatedRecords.splice(index, 1);
      setSplitRecords(updatedRecords);
    }
  };

  const handleSplitRecordChange = (index, field, value) => {
    const updatedRecords = [...splitRecords];
    updatedRecords[index][field] = value;
    setSplitRecords(updatedRecords);
  };

  const handleAddTransferButtonClick = () => {

    console.log(transferDate);
    console.log(splitRecords);
    console.log(selectedCategories);
    // walidacja czy pola są uzupełnione czy się zgadza suma split i transfer
    //utworzenie requestu i Post do Api
    // błąd lub sukces na toastr
    // jesli sukces to czyszczenie wszystkiego na formie i usunięcie splitów
  };

  const handleDropdownBudgetChange = async (event) => {
    const { value } = event.target;
    setBudgetId(value);
    try {
      const url = config.API_ENDPOINTS.BUDGET_CATEGORIES.replace(
        "{budgetId}",
        value
      );
      const response = await axios.get(`${config.API_BASE_URL}${url}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching budgetCategories:", error);
    }
  };

  const handleCategoryChange = (index, value) => {
    const updatedCategories = [...selectedCategories];
    updatedCategories[index] = value;
    setSelectedCategories(updatedCategories);
  };

  const handleDropdownAccountChange = (event) => {
    const { value } = event.target;
    setAccountId(value);
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

        const defaultBudget = response.data.budgets.find(
          (budget) => budget.id === response.data.currentBudgetId
        );

        setBudgets(response.data.budgets);
        setCategories(response.data.currentBudgetCategories);
        setAccounts(response.data.currentBudgetAccounts);
        setBudgetId(defaultBudget ? defaultBudget.id : "");
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchBudgets();
  }, [jwtToken]);

  return (
    <>
      <Paper elevation={3} sx={{ margin: "20px" }}>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="budgetSelect">Budżet</InputLabel>
            <Select
              labelId="budgetSelect"
              id="budgetSelect"
              value={budgetId ?? ""}
              label="Budget"
              name="budgetId"
              onChange={handleDropdownBudgetChange}
            >
              {budgets.map((budget) => (
                <MenuItem key={budget.id} value={budget.id}>
                  {budget.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="accountSelect">Konto</InputLabel>
            <Select
              labelId="accountSelect"
              id="accountSelect"
              value={accountId ?? ""}
              label="Account"
              name="accountId"
              onChange={handleDropdownAccountChange}
            >
              {accounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField id="transferName" label="Nazwa" variant="outlined" />
          <TextField id="transferDescription" label="Opis" variant="outlined" />
          <TextField id="transferValue" label="Wartość" variant="outlined" />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Data Transferu"
              value={transferDate ?? AdapterDayjs.date()}
              onChange={(newDate) => setTransferDate(newDate)}
            />
          </LocalizationProvider>
          <Button variant="outlined" onClick={handleAddTransferButtonClick}>
            Zapisz
          </Button>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ margin: "20px" }}>
        <Button variant="outlined" onClick={handleAddSplitRecord}>
          Dodaj Split
        </Button>
        {splitRecords.map((record, index) => (
          <Box
            key={"key_splitBox_" + index}
            sx={{
              display: "flex",
              whiteSpace: "nowrap",
              "& > :not(style)": { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
            <IconButton
              aria-label="delete"
              onClick={() => handleDeleteSplitRecord(index)}
            >
              <DeleteIcon />
            </IconButton>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="categorySelect">Kategoria</InputLabel>
              <Select
                labelId={`categorySelect_${index}`}
                id={`categorySelect_${index}`}
                value={selectedCategories[index] ?? ""}
                label="Category"
                name={`categoryId_${index}`}
                onChange={(e) => handleCategoryChange(index, e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              id={"splitName_" + index}
              variant="outlined"
              label="Nazwa"
              value={record.name}
              onChange={(e) =>
                handleSplitRecordChange(index, "name", e.target.value)
              }
            />
            <TextField
              id={"splitDescription" + index}
              variant="outlined"
              label="Opis"
              value={record.description}
              onChange={(e) =>
                handleSplitRecordChange(index, "description", e.target.value)
              }
            />
            <TextField
              id={"splitValue_" + index}
              variant="outlined"
              label="Wartość"
              value={record.value}
              onChange={(e) =>
                handleSplitRecordChange(index, "value", e.target.value)
              }
            />
          </Box>
        ))}
      </Paper>
    </>
  );
}

export default AddExpense;
